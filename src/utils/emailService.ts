import crypto from 'crypto';
import AppError  from './AppError';
import logger from './logger';


// Generate cryptographically secure OTP
const generateSecureOTP = () => {
    // Use crypto.randomInt for cryptographically secure random numbers
    return crypto.randomInt(100000, 999999).toString();

};



// Make transporter
const emailSender = async (email: string, subject: string, body: string) => {
    try {
        const response = await fetch('https://enneaprofiling.estamart.com/api/send_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: process.env.API_KEY,
                email: email,
                subject: subject,
                body: body
            })
        });

        if (!response.ok) {
            throw new Error(`Email sending failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        logger.error('Error sending email:', error);
        throw error;
    }
}



// 1. Enhanced Verification Code with security improvements
const verificationCode = async (to : string, username: string, code: string) => {
    try {
        const emailData = {
            to: to,// mail of the user to be sent
            subject: "Your Verification Code - Monarch Auth System",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #333; margin: 0;">👑 Monarch Auth System</h1>
                        <p style="color: #666; margin: 5px 0;">Royal Security for Your Account</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: white; margin: 0 0 20px 0; text-align: center;">Hello ${username}!</h2>
                        <p style="color: white; margin: 0 0 20px 0; text-align: center;">Your verification code is:</p>
                        
                        <div style="background-color: rgba(255,255,255,0.2); padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: white; font-family: 'Courier New', monospace;">
                                ${code}
                            </div>
                        </div>
                        
                        <p style="color: white; font-size: 14px; text-align: center; margin: 0;">
                            ⏰ This code will expire in 10 minutes
                        </p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #666; font-size: 14px; margin: 0; text-align: center;">
                            🔒 If you didn't request this code, please ignore this email.
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <div style="text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            This is an automated message from Monarch Auth System.<br>
                            Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };
        // Send the email using Resend API
        const result = await emailSender(emailData.to, emailData.subject, emailData.html);

        if (result.error) {
            logger.error("API Error:", result.error);
            throw new AppError("Failed to send verification email", 500);
        }
        return true;
    } catch (error) {
        logger.error("Error in verification code email:", error);
        throw error;
    }
};