import {model, models, Schema} from "mongoose";

const UserSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String},
  image: {type: String},
  cart: [{
    _id: String,
    title: String,
    price: Number,
    image: String,
    quantity: Number,
    description: String
  }]
}, {timestamps: true});

export const User = models?.User || model('User', UserSchema);