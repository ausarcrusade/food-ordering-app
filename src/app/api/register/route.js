import {User} from "@/models/User";
import mongoose from "mongoose";
require('dotenv').config();
import bcrypt from 'bcrypt';

export async function POST(req) {
  const body = await req.json();
  const {email, password} = body;

  // Validate password length
  if (password.length < 5) {
    return Response.json(
      {error: 'password_too_short'},
      {status: 422}
    );
  }
  
  mongoose.connect(process.env.MONGO_URL);
  
  const existingUser = await User.findOne({email});
  if (existingUser) {
    return Response.json(
      {error: 'email_exists'},
      {status: 422}
    );
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with hashed password
  const createdUser = await User.create({
    email,
    password: hashedPassword
  });
  
  return Response.json(createdUser);
}
  
// Receives user data including a password
// Validates the password length
// Hashes the password for secure storage
// Creates a new user in the MongoDB database
// Returns the created user data
// Throws an error if the password is less than 5 characters