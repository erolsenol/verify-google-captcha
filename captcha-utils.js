const fetch = require('node-fetch');

module.exports = {
  verifyGoogleCaptcha: async (secret, captcha, remoteIp) => {
    const captchaURL = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}&remoteip=${remoteIp}`;
    try {
      const response = await fetch(captchaURL).then((res) => res.json());
      return response.success;
    }
    catch (err) {
      return false;
    }
  }
};
