import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter object using the Gmail SMTP server
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // Your Gmail email address
    pass: process.env.SMTP_PASS, // Your Gmail password or App Password
  },
});

export async function POST(request: Request) {
  try {
    const { to, subject, text } = await request.json();

    // Split the 'to' field by commas and trim whitespace
    const recipients = to.split(',').map((email: string) => email.trim());

    console.log('Attempting to send email...');
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '[REDACTED]' : 'Not set');

    const info = await transporter.sendMail({
      from: `"NIGGASAURUS" <${process.env.SMTP_USER}>`, // Sender address
      to: recipients,
      subject,
      text,
    });

    console.log('Email sent successfully:', info.messageId);
    return NextResponse.json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: (error as Error).message }, { status: 500 });
  }
}
