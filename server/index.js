const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
require('dotenv').config();
app.use(express.json());

const nodemailer = require('nodemailer');

app.post('/api/appointments', (req, res) => {
    const { name, lastname, email, datetime, message } = req.body;

    const mailOptions = {
        from: process.env.SMTPEMAIL,
        to: process.env.SMTPEMAIL,
        subject: `Nouveau rendez-vous pris par ${name} ${lastname}`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouveau rendez-vous pris par ${name} ${lastname}</title>
        </head>
        <body>
            <div>
                <h1>Boumitec</h1><br>
                <p>
                Bonjour,

                    Un nouveau rendez-vous a été pris par un client. Voici les détails :<br>
                    Nom : ${name} ${lastname}<br>
                    Email : ${email}<br>
                    Date et heure du rendez-vous : ${datetime}<br>
                    Message : ${message}<br>
                    Veuillez prendre les dispositions nécessaires pour accueillir ce client à l'heure convenue.<br><br>
                    Cordialement,<br>
                    ${name} ${lastname}<br>
                    Boumitec
                </p>
            </div>
        </body>
        </html>
        `
    };

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTPEMAIL,
            pass: process.env.SMTPPASSWORD
        }
    });

    transporter.sendMail(mailOptions, (emailError, info) => {
        if (emailError) {
            throw emailError;
        }
    });

    res.status(200).json({ message: 'Appointment received successfully!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
