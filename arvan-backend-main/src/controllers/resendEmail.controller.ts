import { Request, Response } from 'express';
import { Resend } from 'resend';
import ENV from '../common/env.js';
import { ValidationErr } from '../common/routeerror.js';
import { prisma } from '../utils/prismaclient.js';

const resend = new Resend(ENV.RESEND_API_KEY);

// Utility function to generate user confirmation email
const generateUserConfirmationEmail = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting us!</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          margin: 20px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .footer {
          background: #343a40;
          color: white;
          text-align: center;
          padding: 20px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You, ${name}!</h1>
        </div>
        <div class="content">
          <h2>We received your message</h2>
          <p>Thank you for reaching out to The Arvan. We've received your inquiry and will get back to you within 24 hours.</p>
          <p>In the meantime, feel free to browse our collection of premium footwear.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.FRONTENDURL || 'https://yourwebsite.com'}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Shop Now</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>The Arvan</strong> - Your Fashion Destination</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Utility function to generate email HTML content
const generateEmailContent = (name: string, email: string, phone: string, message: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          margin: 20px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .field {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .field-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 5px;
          display: block;
        }
        .field-value {
          color: #212529;
          margin: 0;
        }
        .message-field {
          background: #fff3cd;
          border-left-color: #ffc107;
        }
        .message-content {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer {
          background: #343a40;
          color: white;
          text-align: center;
          padding: 20px;
          font-size: 14px;
        }
        .logo {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .highlight {
          color: #667eea;
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
          }
          .header, .content, .footer {
            padding: 20px 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📬</div>
          <h1>New Contact Form Submission</h1>
          <p>You have received a new message from your website</p>
        </div>

        <div class="content">
          <div class="field">
            <span class="field-label">👤 Name:</span>
            <p class="field-value">${name}</p>
          </div>

          <div class="field">
            <span class="field-label">📧 Email:</span>
            <p class="field-value">${email}</p>
          </div>

          <div class="field">
            <span class="field-label">📞 Phone:</span>
            <p class="field-value">${phone}</p>
          </div>

          <div class="field message-field">
            <span class="field-label">💬 Message:</span>
            <div class="message-content">${message}</div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; margin: 0;">
              This message was sent from your website's contact form
            </p>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0;">
            <strong>The Arvan</strong> - Your Fashion Destination
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">
            © 2025 The Arvan. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendEmail = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !message) {
    throw new ValidationErr('Missing required fields');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationErr('Invalid email format');
  }

  // Validate phone format (accepts international numbers with country code)
  const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?(\d{1,3})\)?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/; // Accepts international phone numbers
  if (!phoneRegex.test(phone)) {
    throw new ValidationErr('Invalid phone number');
  }

  const emailContent = generateEmailContent(name, email, phone, message);

  try {
    // CURRENT LOGIC: Send to admin email only (works without domain verification)
    const response = await resend.emails.send({
      from: ENV.RESEND_EMAIL,
      to: ENV.RESEND_EMAIL, // Send to admin email instead of user's email
      subject: 'New Contact Form Submission - The Arvan',
      html: emailContent,
    });

    // FUTURE LOGIC: Uncomment below when you have a verified domain
    // This will send confirmation emails to users AND notifications to admin
    /*
    // Check if we have a verified domain (you can add this check based on your domain setup)
    const hasVerifiedDomain = ENV.RESEND_EMAIL.includes('@yourdomain.com'); // Replace with your actual domain check

    if (hasVerifiedDomain) {
      // Send confirmation email to the user
      const userResponse = await resend.emails.send({
        from: ENV.RESEND_EMAIL, // Use your verified domain email
        to: email, // Send to the actual user
        subject: 'Thank you for contacting The Arvan!',
        html: generateUserConfirmationEmail(name), // Create a separate function for user confirmation
      });

      // Also send notification to admin
      const adminResponse = await resend.emails.send({
        from: ENV.RESEND_EMAIL,
        to: ENV.RESEND_EMAIL,
        subject: 'New Contact Form Submission - The Arvan',
        html: emailContent,
      });

      if (userResponse.data && adminResponse.data) {
        // Both emails sent successfully
      }
    } else {
      // Fallback: Send only to admin (current behavior)
      const response = await resend.emails.send({
        from: ENV.RESEND_EMAIL,
        to: ENV.RESEND_EMAIL,
        subject: 'New Contact Form Submission - The Arvan',
        html: emailContent,
      });
    }
    */

    if (response.data) {
      // Save contact form submission to database
      await prisma.contactForm.create({
        data: {
          name,
          email,
          phone: String(phone),
          message,
          Status: 'Pending',
        },
      });

      res.status(200).json({ message: 'Contact form submitted successfully! We will get back to you soon.' });
    } else {
      console.error('Failed to send email:', response.error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const allEmails = async (req: Request, res: Response): Promise<void> => {
  try {
    const emails = await prisma.contactForm.findMany();
    res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ message: 'Failed to fetch emails' });
  }
};

const deleteEmail = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.contactForm.delete({ where: { id: id.toString() } });
    res.status(200).json({ message: 'Email deleted successfully' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ message: 'Failed to delete email' });
  }
};

const updateStatussendMail = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { Status, message } = req.body;

  // Validate status
  const validStatuses = ["Pending", "Responded", "Closed"];
  if (!validStatuses.includes(Status)) {
     res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Fetch contact details to get name, email, and phone
    const contact = await prisma.contactForm.findUnique({
      where: { id: String(id) },
    });

    if (!contact) {
       res.status(404).json({ message: "Contact not found" });
    }

    // Generate email content
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    const emailContent = generateEmailContent(contact.name, contact.email, contact.phone, message);

    // Send email using Resend
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: contact.email,
      subject: 'Response to Your Inquiry ✅',
      html: emailContent,
    });

    if (!response.data) {
      console.error('Failed to send email:', response.error);
       res.status(500).json({ message: 'Failed to send email' });
    }

    // Update status in the database
    const updatedContact = await prisma.contactForm.update({
      where: { id: String(id) },
      data: { Status: Status },
    });

    res.status(200).json({ message: "Email sent and status updated successfully", updatedContact });
  } catch (error) {
    console.error("Error updating status and sending email:", error);
    res.status(500).json({ message: "Failed to update status and send email" });
  }
};


export default { sendEmail, allEmails, deleteEmail, updateStatussendMail };