import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { email } = req.body;

  // Create a magic link token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  const transporter = nodemailer.createTransport({
    host: "mail.example.com",
    port: 587,
    secure: false,
    auth: {
      user: 'support@wordmuse.net',
      pass: process.env.GOOGLE_APP_PASSWORD
    },
  });

  // Generate magic link
  const magicLink = `${req.headers.origin}/api/verify?token=${token}`;

  await transporter.sendMail({
    from: '"Samuel Armen" <hgagdere@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Face Recognition Study login', // Subject line
    text: `Click on this link to log in: ${magicLink}`, // plain text body
  });

  return new Response(JSON.stringify({
    data: [],
    error: ""
  }), { status: 200 })
}