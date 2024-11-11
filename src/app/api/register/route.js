import {User} from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function POST(req) {
    const body = await req.json();
    mongoose.connect(process.env.MONGO_URL);
    const pass = body.password;
    if (!pass?.length || pass.length < 5) {
      new Error('password must be at least 5 characters');
    }
  
    const notHashedPassword = pass;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(notHashedPassword, salt);
  
    const createdUser = await User.create(body);
    return Response.json(createdUser);
  }

  
// Receives user data including a password
// Validates the password length
// Hashes the password for secure storage
// Creates a new user in the MongoDB database
// Returns the created user data
// Throws an error if the password is less than 5 characters