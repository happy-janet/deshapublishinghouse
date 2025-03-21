const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure SMTP transport options
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Use Gmail's SMTP host
    port: 587, // Secure port for STARTTLS
    secure: false, // Set to true if using port 465, false for 587
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your app-specific password
    },
    tls: {
        rejectUnauthorized: false, // Optional: Bypass TLS certificate validation
    },
});

// Enable debugging
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('SMTP Server is ready to take messages');
    }
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Desha Publishing House" <${process.env.EMAIL_USER}>`, // Use the email address from environment variables
      to, // Receiver's address
      subject, // Subject line
      text, // Plain text body
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;




// const nodemailer = require('nodemailer');

// // Configure SMTP transport options
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com', // Use Gmail's SMTP host
//     port: 587, // Secure port for STARTTLS
//     secure: false, // Set to true if using port 465, false for 587
//     auth: {
//         user: process.env.EMAIL_USER, // Your Gmail address
//         pass: process.env.EMAIL_PASS  // Your app-specific password
//     }
// });

// // Function to send an email
// const sendEmail = async (to, subject, text) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Desha Publishing House" <${process.env.EMAIL_USER}>`, // Use the email address from environment variables
//       to, // Receiver's address
//       subject, // Subject line
//       text, // Plain text body
//     });

//     console.log('Email sent:', info.messageId);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// module.exports = sendEmail;
