import express from 'express';
import { Resend } from 'resend';

const router = express.Router();
const resend = new Resend('re_hamosuxW_GqcsnfhhBVY1SGtv84A5BXLw');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateEmailRequest = (req, res, next) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: to, subject, html',
    });
  }

  const emailList = Array.isArray(to) ? to : [to];
  const validEmails = emailList.filter(email => validateEmail(email));
  
  if (validEmails.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid email addresses provided',
    });
  }

  if (validEmails.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Too many recipients. Maximum 50 emails per request.',
    });
  }

  req.validatedEmails = validEmails;
  next();
};

router.post('/send', validateEmailRequest, async (req, res) => {
  try {
    const { subject, html } = req.body;
    const { validatedEmails } = req;
    console.log(req.body)
    console.log(`Attempting to send email to ${validatedEmails.length} recipients`);

    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    const emailConfig = {
      from: process.env.EMAIL_FROM || 'College Announcements <onboarding@resend.dev>',
      subject: subject,
      html: html,
      reply_to: process.env.EMAIL_REPLY_TO || 'support@yourcollege.edu',
    };

    // if (isDevelopment) {
    //   emailConfig.to = 'delivered@resend.dev';
    //   emailConfig.bcc = validatedEmails.slice(0, 5);
    // } else {
    //   emailConfig.to = validatedEmails;
    // }
    emailConfig.to = validatedEmails;
    const { data, error } = await resend.emails.send(emailConfig);

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to send email.',
        error: process.env.NODE_ENV === 'production' ? 'Email service error' : error,
      });
    }

    console.log('Email sent successfully:', data);
    
    res.status(200).json({
      success: true,
      message: `Email sent successfully to ${validatedEmails.length} recipients!`,
      data: {
        id: data.id,
        recipients: validatedEmails.length,
        isDevelopment: isDevelopment
      },
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred.',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
});

router.get('/test', async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured (missing RESEND_API_KEY)',
      });
    }

    res.json({
      success: true,
      message: 'Email service is configured and ready',
      config: {
        from: process.env.EMAIL_FROM || 'College Announcements <onboarding@resend.dev>',
        replyTo: process.env.EMAIL_REPLY_TO || 'support@yourcollege.edu',
        environment: process.env.NODE_ENV || 'development'
      }
    });

  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: process.env.NODE_ENV === 'production' ? 'Service error' : error.message
    });
  }
});

export default router;
