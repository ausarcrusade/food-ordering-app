import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail({ email, orderNumber, orderDetails }) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Order Confirmation #${orderNumber}`,
        html: `
            <h1>Thank you for your order!</h1>
            <p>Your order #${orderNumber} has been confirmed.</p>
            <p>We'll notify you when your order is ready.</p>
            <!-- Add more order details here -->
        `,
    });
}
