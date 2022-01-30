const fetch = require('node-fetch');

async function verifyGoogleCaptcha(secret, captcha, remoteIp) {
  const captchaURL = `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}&remoteip=${remoteIp}`;
  try {
    const response = await fetch(captchaURL).then((res) => res.json());
    console.log(response);
    return response.success;
  }
  catch (err) {
    return false;
  }
}

module.exports = {
  verifyGoogleCaptcha,
}
