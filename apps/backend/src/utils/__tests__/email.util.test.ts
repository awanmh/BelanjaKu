// File: src/utils/__tests__/email.util.test.ts
import { describe, expect, it, beforeEach, jest } from '@jest/globals';

describe('Email Utility', () => {
    let emailUtil: any;
    let mockSendMail: any;

    beforeEach(() => {
        jest.resetModules();

        // PERBAIKAN: Definisikan mock function terpisah dari mockResolvedValue
        // agar TypeScript tidak bingung dengan tipe datanya
        mockSendMail = jest.fn();
        mockSendMail.mockResolvedValue({ messageId: 'test-id' });

        // Setup Mock Nodemailer
        jest.doMock('nodemailer', () => ({
            createTransport: jest.fn(() => ({
                sendMail: mockSendMail,
            })),
        }));

        // Load file util SETELAH mock siap
        // Pastikan path '../email.util' benar. 
        // File test ini HARUS ada di folder src/utils/__tests__/
        emailUtil = require('../email.util');
    });

    describe('sendEmail', () => {
        it('should send an email using nodemailer transporter', async () => {
            const to = 'test@example.com';
            const subject = 'Test Subject';
            const html = '<p>Test Body</p>';

            await emailUtil.sendEmail(to, subject, html);

            expect(mockSendMail).toHaveBeenCalledTimes(1);
            expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to,
                subject,
                html,
            }));
        });

        it('should throw an error if sending fails', async () => {
            // Setup error simulation
            mockSendMail.mockRejectedValueOnce(new Error('SMTP Error'));

            await expect(emailUtil.sendEmail('fail@test.com', 'Subj', 'Body'))
                .rejects
                .toThrow('Email service failed');
        });
    });

    describe('sendOrderConfirmationEmail', () => {
        it('should send email with correct subject', async () => {
            const email = 'customer@example.com';
            const orderDetails = { id: 'ORDER-123', totalAmount: 50000 };

            await emailUtil.sendOrderConfirmationEmail(email, orderDetails);

            expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: email,
                subject: expect.stringContaining('ORDER-123'),
            }));
        });
    });

    describe('sendResetPasswordEmail', () => {
        it('should send email containing the reset token', async () => {
            const email = 'user@example.com';
            const token = 'abcdef123456';

            await emailUtil.sendResetPasswordEmail(email, token);

            expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: email,
                html: expect.stringContaining(token),
            }));
        });
    });
});
