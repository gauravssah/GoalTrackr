const nodemailer = require("nodemailer");

function getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        }
    });
}

async function sendPasswordResetOtpEmail({ to, name, otp }) {
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to,
        subject: "Your GoalTrackr password reset OTP",
        text: `Hi ${name || "there"},\n\nYour GoalTrackr OTP for password reset is: ${otp}\n\nThis OTP expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Hi ${name || "there"},</p><p>Your GoalTrackr OTP for password reset is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px;">${otp}</p><p>This OTP expires in <strong>10 minutes</strong>.</p><p>If you did not request this, you can ignore this email.</p>`
    });
}

module.exports = {
    sendPasswordResetOtpEmail
};
