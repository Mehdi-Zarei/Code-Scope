function generateResetPasswordEmail(name, token, expiration) {
  return `
    <p>سلام ${name} عزیز،</p>
    <p>درخواست تغییر رمز عبور برای حساب کاربری شما ثبت شده است. اگر این درخواست از سمت شما بوده است، لطفاً از طریق لینک زیر اقدام به تغییر رمز عبور خود کنید:</p>
    <a href="${process.env.RESET_PASSWORD_DOMAIN}/${token}">تغییر رمز عبور</a>
    <p>این لینک تا <strong>${expiration}</strong> آینده معتبر است. اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید یا با پشتیبانی تماس بگیرید.</p>
    <p>با تشکر،</p>
    <p>تیم پشتیبانی</p>
  `;
}

module.exports = { generateResetPasswordEmail };
