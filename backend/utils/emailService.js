import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || 'UniSphere'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Welcome email template
  async sendWelcomeEmail(user) {
    const subject = `Welcome to ${process.env.APP_NAME || 'UniSphere'}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to UniSphere!</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for joining UniSphere! We're excited to have you as part of our campus community.</p>
        <p>With UniSphere, you can:</p>
        <ul>
          <li>Discover and join clubs that match your interests</li>
          <li>Register for exciting campus events</li>
          <li>Connect with fellow students in our community</li>
          <li>Stay updated with campus activities</li>
        </ul>
        <p>Get started by exploring clubs and events on our platform!</p>
        <p>Best regards,<br>The UniSphere Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Event registration confirmation
  async sendEventRegistrationEmail(user, event) {
    const subject = `Event Registration Confirmed - ${event.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Event Registration Confirmed!</h2>
        <p>Hi ${user.name},</p>
        <p>Your registration for <strong>${event.title}</strong> has been confirmed!</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Event Details:</h3>
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${event.time_start}</p>
          <p><strong>Venue:</strong> ${event.venue}</p>
          ${event.price > 0 ? `<p><strong>Price:</strong> ₹${event.price}</p>` : ''}
        </div>
        <p>We look forward to seeing you at the event!</p>
        <p>Best regards,<br>The UniSphere Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Club membership confirmation
  async sendClubJoinEmail(user, club) {
    const subject = `Welcome to ${club.name}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ${club.name}!</h2>
        <p>Hi ${user.name},</p>
        <p>Congratulations! You've successfully joined <strong>${club.name}</strong>.</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Club Information:</h3>
          <p><strong>Club:</strong> ${club.name}</p>
          <p><strong>Category:</strong> ${club.category}</p>
          ${club.description ? `<p><strong>About:</strong> ${club.description}</p>` : ''}
        </div>
        <p>Stay tuned for upcoming events and activities from ${club.name}!</p>
        <p>Best regards,<br>The UniSphere Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }
}

export default new EmailService();
