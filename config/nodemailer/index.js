const nodemailer = require("nodemailer");

const Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

exports.sendVerificationMail = async (user, verificationToken) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Email Confirmation",
    html: `
         <!DOCTYPE html>
             <html>
              <head>               
              </head>
               <body>
               <h4> Hello ${user.name} </h4>
               <br>
               <p style="color:gray;"> Thank you for registering with us </p>
               <br>
               <p><a href="http://localhost/verify?id=${verificationToken}"> Click Here </a> To Complete Your Registration </p>
               </body>
             </html>
         `,
  };

  try {
    const response = await Transporter.sendMail(mailOptions);
    return response;
  } catch (err) {
    return false;
  }
};
