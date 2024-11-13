import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true
  },
  items: [{
    title: String,
    price: Number,
    quantity: Number,
    image: String,
    addOns: [{
      id: String,
      name: String,
      price: Number,
      category: String,
      icon: String
    }]
  }],
  total: {
    type: Number,
    required: true
  },
  deliveryOption: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    instructions: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Order = mongoose.models?.Order || mongoose.model('Order', OrderSchema);
