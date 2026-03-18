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

        await transporter.sendMail({
            from: "jayakumarkaviya22@gmail.com",
            to: to,
            subject: subject,
            text: message
        });

        console.log("📧 Email sent successfully");

    } catch (error) {

        console.log("Email error:", error);

    }

};

module.exports = sendEmail;