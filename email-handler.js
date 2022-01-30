const express = require('express');
const sendgrid = require("@sendgrid/mail");
const router = express.Router();
const { verifyGoogleCaptcha } = require('./utils');

router.post('/', async function (req, res) {
  const {
    mailTo,
    mailData,
    templateId,
    captcha,
    remoteIp,
  } = req.body;

  if (mailTo) {
    if (mailTo.length > 10) {
      return res.json({ success: false, msg: "Too many senders" });
    }
  } else if (!mailTo || mailTo.length === 0) {
    return res.json({ success: false, msg: "Unknown recipient" });
  }

  if (!captcha) {
    return res.json({ success: false, msg: "Captcha is required" });
  }

  if (!remoteIp) {
    return res.json({ success: false, msg: "Unknown sender" });
  }

  const captchaSecret = process.env.RECAPTCHA_SECRET;
  const captchaResult = await verifyGoogleCaptcha(captchaSecret, captcha, remoteIp);
  if (!captchaResult) {
    return res.json({ success: false, msg: "Failed captcha verification" });
  }

  const fromEmail = process.env.FROM_EMAIL;
  const fromName = process.env.FROM_NAME;
  const { title, name, phone, email, company, message } = mailData

  try {
    await sendgrid.send({
      from: {
        email: fromEmail,
        name: fromName,
      },
      to: mailTo,
      templateId,
      dynamic_template_data: {
        title,
        name,
        phone,
        email,
        company,
        message,
        date: new Date(),
      },
    });
    return res.json({ success: true, msg: "Email has been sent successfully" });  
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: "An error occurred while sending email" });
  }
});

module.exports = router;
