const request = require('supertest');
const app = require('./server.js');
const captchaUtils = require('./captcha-utils');

describe('Email Handler', () => {
  const mailReqParams = {
    templateId: 'd-7f94565abb404613bda702873be26692',
    captcha: 'test-captcha',
    remoteIp: 'test.domain.co',
    mailTo: [
      'erol.senol@idenfit.com',
    ],
    mailData: {
      title: 'Guardware Formu',
      name: 'asd sdf',
      phone: '344',
      email: 'metehansenol@gmail.com',
      company: 'dfsd',
      message: 'Hello'
    }
  };

  it('should return valid get response', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello World!');
  });

  it('should return error with invalid sender', async () => {
    const res = await request(app)
      .post('/')
      .send({
        ...mailReqParams,
        mailTo: [],
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe('Unknown recipient');
  });

  it('should send email successfully with valid params', async () => {
    captchaUtils.verifyGoogleCaptcha = jest.fn().mockResolvedValue(true);

    const res = await request(app)
      .post('/')
      .send({
        ...mailReqParams,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.msg).toBe('Email has been sent successfully');
  });
});
