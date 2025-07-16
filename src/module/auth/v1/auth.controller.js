const { hashData, comparHashedData } = require("../../../helper/bcrypt");

const { generateAccessToken, generateRefreshToken, verifyToken } = require("../../../helper/jwtTokens");

const { saveData, removeData, saveDataAsHash, getDataAsHash, getData } = require("../../../helper/redis");

const { errorResponse, successResponse } = require("../../../helper/responseMessage");

const User = require("../../../model/User");

const { generateResetPasswordEmail } = require("../../../templates/emailsTemplates");

const { sendEmail } = require("../../../utils/nodemailer");

const uuid = require("uuid").v4;

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return errorResponse(res, 409, "ایمیل تکراری می باشد.");
    }

    const hashedPassword = await hashData(password);

    const isFirstUser = (await User.countDocuments()) === 0;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isFirstUser ? "ADMIN" : "USER",
    });

    const accessToken = await generateAccessToken(newUser._id, newUser.role);
    const refreshToken = await generateRefreshToken(newUser._id, newUser.role);

    const hashRefreshToken = await hashData(refreshToken);
    await saveData(`refreshToken:${newUser._id}`, hashRefreshToken, 2592000);

    return successResponse(res, 201, "ثبت نام با موفقیت انجام شد.", { accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return errorResponse(res, 401, "ایمیل یا پسوورد اشتباه می باشد.");
    }

    if (isUserExist.isRestrict) {
      return errorResponse(res, 403, "حساب کاربری شما توسط مدیریت وبسایت مسدود گردیده است.");
    }

    const isCorrectPassword = await comparHashedData(password, isUserExist.password);
    if (!isCorrectPassword) {
      return errorResponse(res, 401, "اطلاعات وارد شده صحیح نمی باشد.");
    }

    const accessToken = await generateAccessToken(isUserExist._id, isUserExist.role);
    const refreshToken = await generateRefreshToken(isUserExist._id, isUserExist.role);

    const hashRefreshToken = await hashData(refreshToken);

    await saveData(`refreshToken:${isUserExist._id}`, hashRefreshToken, 2592000);

    return successResponse(res, 200, "شما با موفقیت وارد حساب کاربری خود شدید.", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return errorResponse(res, 401, "لطفا وارد حساب کاربری خود شوید.");
    }

    const isCorrectToken = await verifyToken(token, process.env.JWT_SECRET_REFRESH_TOKEN);
    if (!isCorrectToken) {
      return errorResponse(res, 401, "توکن ارسالی معتبر نمی باشد.");
    }

    const user = await User.findById(isCorrectToken.id);
    if (!user || user.isRestrict) {
      return errorResponse(res, 401, "شما دسترسی لازم به این مسیر را ندارید.");
    }

    const storedToken = await getData(`refreshToken:${isCorrectToken.id}`);
    if (!storedToken) {
      return errorResponse(res, 401, "لطفا وارد حساب کاربری خود شوید.");
    }

    const compareToken = await comparHashedData(token, storedToken);
    if (!compareToken) {
      return errorResponse(res, 401, "توکن ارسالی معتبر نمی باشد.");
    }

    const newAccessToken = await generateAccessToken(user._id, user.role);

    return successResponse(res, 200, newAccessToken);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = req.user;

    const removeRefreshToken = await removeData(`refreshToken:${user._id}`);
    if (!removeRefreshToken) {
      return errorResponse(res, 401, "شما پیش‌تر از حساب کاربری خود خارج شده‌اید یا جلسه شما منقضی شده است.");
    }

    return successResponse(res, 200, "شما با موفقیت از حساب کاربری خود خارج شدید.");
  } catch (error) {
    next(error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 404, "کاربری با این ایمیل یافت نشد.");
    }

    if (user.isRestrict) {
      return errorResponse(res, 403, "حساب کاربری شما توسط مدیریت وبسایت مسدود شده است.");
    }

    const resetPasswordToken = uuid();

    const subject = "Reset Password Link";
    const template = generateResetPasswordEmail(user.name, resetPasswordToken, 1);

    const sendResetPasswordLink = await sendEmail(user, subject, template);

    if (sendResetPasswordLink) {
      await saveDataAsHash(`resetPasswordToken:${resetPasswordToken}`, { resetPasswordToken, email }, 3600);
      return successResponse(res, 200, "لینک فراموشی رمز عبور با موفقیت به ایمیل شما ارسال گردید.");
    } else {
      return errorResponse(res, 500, "خطا در ارسال لینک فراموشی رمز عبور،لطفا بعدا مجدد سعی نمایید.");
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const storedToken = await getDataAsHash(`resetPasswordToken:${token}`);
    if (!storedToken || storedToken.resetPasswordToken !== token) {
      return errorResponse(res, 401, "لینک تغییر پسوورد معتبر نبوده و یا منقضی شده است.");
    }

    const user = await User.findOne({ email: storedToken.email });
    if (!user) {
      return errorResponse(res, 404, "کاربری با این ایمیل یافت نشد.");
    }

    const hashedPassword = await hashData(password);

    user.password = hashedPassword;
    await user.save();

    await removeData(`resetPasswordToken:${token}`);

    return successResponse(res, 200, "رمز عبور شما با موفقیت تغییر کرد.");
  } catch (error) {
    next(error);
  }
};
