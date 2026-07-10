import nodemailer from "nodemailer"

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS:', process.env.GMAIL_PASS);


export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user : process.env.GMAIL_USER,
        pass : process.env.GMAIL_PASS,
    },
})

transporter.verify((error, success) => {
    if (error) {
        console.log('Error en transporter:', error);
    } else {
        console.log('Transporter listo para enviar mails');
    }
});
