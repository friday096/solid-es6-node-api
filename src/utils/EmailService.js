import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
class EmailService {
  constructor(user = process.env.SMTP_USER, pass = process.env.SMTP_PASS, fromAddress = process.env.EMAIL_FROM) {
    if (!user || !pass) {
      throw new Error('SMTP credentials are required');
    }
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user,
        pass,
      },
    });
    this.fromAddress = fromAddress || user;
  }

  async send(to, subject, htmlContent) {
    const mailOptions = {
      from: this.fromAddress,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error.message);
      return { success: false, message: `Email sending failed: ${error.message}` };
    }
  }
}

export default EmailService;
