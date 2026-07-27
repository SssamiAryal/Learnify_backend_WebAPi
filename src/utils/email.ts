import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetCode = async (
  email: string,
  code: string
) => {
  await transporter.sendMail({
    from: `"Learnify" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Learnify Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Learnify Password Reset</h2>

        <p>Your verification code is:</p>

        <h1 style="color:#5B3DF5;letter-spacing:4px;">
          ${code}
        </h1>

        <p>This code will expire in 10 minutes.</p>

        <p>If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
};