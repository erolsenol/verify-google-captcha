const https = require("https");
const fs = require("fs");
const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const sendgrid = require("@sendgrid/mail");

dotenv.config();

sendgrid.setApiKey(process.env.SG_API_KEY);

const emailHandler = require('./email-handler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', emailHandler);

const sslOptions = {
  pfx: fs.readFileSync('./ssl/last.pfx'),
  passphrase: process.env.PASSPHRASE,
};

const httpsServer = https.createServer(sslOptions, app);

const port = (process.env.PORT || 443);

httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});
