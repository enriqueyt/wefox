const nodemailer = require('nodemailer');

const sendEmail = async(option) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'desmond.gorczany@ethereal.email',
      pass: 'MwpUXvJNpyptwZcrmq'
    }
  });

  option.from = 'desmond.gorczany@ethereal.email';

  if (!option.to) {
    throw new Error('');
  }
  if (!option.subject) {
    throw new Error('');
  }
  if (!option.text) {
    throw new Error('');
  }

  return transporter.sendMail(option);
};

module.exports.sendEmail = sendEmail;
