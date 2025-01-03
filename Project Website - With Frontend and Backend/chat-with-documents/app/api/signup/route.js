// app/api/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectToDatabase from '@/lib/config/db';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random OTP and set an expiry time
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Create the user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      otp,
      otpExpiry,
      verified: false
    });

    await newUser.save();

    // Nodemailer setup to send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail service
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail email address
        pass: process.env.EMAIL_APP_PASSWORD, // Your Gmail password or App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      text: `Your OTP for email verification is: ${otp}. It will expire in 5 minutes.`,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        message: 'User created successfully. Please verify your email.',
        // Remove this in production
        developmentOtp: otp 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
