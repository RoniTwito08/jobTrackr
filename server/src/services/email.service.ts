import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verificationToken: string
) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #4f86ff, #39d0ff); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to JobTrackr</h1>
      </div>
      
      <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 12px 12px;">
        <p style="color: #333; font-size: 16px;">Hi ${firstName},</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Thank you for signing up! Please verify your email address to complete your registration.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background: linear-gradient(135deg, #4f86ff, #39d0ff); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          Or copy and paste this link in your browser:<br/>
          <a href="${verificationLink}" style="color: #4f86ff; word-break: break-all;">
            ${verificationLink}
          </a>
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
          This link will expire in 24 hours.
        </p>
      </div>
    </div>
  `;

  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@jobtrackr.com",
      subject: "Verify Your JobTrackr Email",
      html: htmlContent,
    });
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
}
