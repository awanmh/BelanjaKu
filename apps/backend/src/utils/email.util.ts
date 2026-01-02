// File: src/utils/email.util.ts
import nodemailer from 'nodemailer';
// PERBAIKAN: Import 'config' tapi kita beri nama panggilan 'env'
import { config as env } from '../config/env.config';

// PERBAIKAN: Gunakan console sementara agar tidak error soal logger
const logger = console;

// 1. Setup Transporter
const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: env.smtp.from,
            to,
            subject,
            html,
        });
        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Error sending email:', error);
        throw new Error('Email service failed');
    }
};

export const sendOrderConfirmationEmail = async (userEmail: string, orderDetails: any) => {
    const subject = `Konfirmasi Pesanan #${orderDetails.id}`;
    const html = `<h1>Terima Kasih!</h1><p>Order ID: ${orderDetails.id}</p>`;
    return sendEmail(userEmail, subject, html);
};

export const sendResetPasswordEmail = async (userEmail: string, resetToken: string) => {
    const subject = 'Permintaan Reset Password';
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const html = `
    <h1>Reset Password</h1>
    <p>Klik link ini: <a href="${resetLink}">Reset Password</a></p>
  `;
    return sendEmail(userEmail, subject, html);
};
