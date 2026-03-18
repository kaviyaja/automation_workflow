const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jayakumarkaviya22@gmail.com",
        pass: "nsexmnngtbxouitq"
    }
});

const sendEmail = async (to, subject, message) => {
    try {
        console.log("👉 Sending email to:", to);

        const info = await transporter.sendMail({
            from: "jayakumarkaviya22@gmail.com",
            to: to,
            subject: subject,
            text: message
        });

        console.log("✅ Email sent:", info.response);

    } catch (error) {
        console.log("❌ Email error:", error);
    }
};

module.exports = sendEmail;