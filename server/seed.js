const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing users
    await User.deleteMany();

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by pre-save hook
        role: 'admin',
        phone: '1234567890',
        city: 'System',
      },
      {
        name: 'Donor A',
        email: 'donora@example.com',
        password: 'password123',
        role: 'donor',
        bloodGroup: 'A+',
        phone: '9876543210',
        city: 'Bangalore',
      },
      {
        name: 'Donor B',
        email: 'donorb@example.com',
        password: 'password123',
        role: 'donor',
        bloodGroup: 'O+',
        phone: '9876543211',
        city: 'Bangalore',
      },
      {
        name: 'Donor C',
        email: 'donorc@example.com',
        password: 'password123',
        role: 'donor',
        bloodGroup: 'B-',
        phone: '9876543212',
        city: 'Mumbai',
      },
      {
        name: 'Donor D',
        email: 'donord@example.com',
        password: 'password123',
        role: 'donor',
        bloodGroup: 'AB+',
        phone: '9876543213',
        city: 'Delhi',
      },
      {
        name: 'Donor E',
        email: 'donore@example.com',
        password: 'password123',
        role: 'donor',
        bloodGroup: 'O-',
        phone: '9876543214',
        city: 'Bangalore',
      },
      {
        name: 'Recipient X',
        email: 'recipientx@example.com',
        password: 'password123',
        role: 'recipient',
        phone: '5555555551',
        city: 'Bangalore',
      },
      {
        name: 'Recipient Y',
        email: 'recipienty@example.com',
        password: 'password123',
        role: 'recipient',
        phone: '5555555552',
        city: 'Mumbai',
      },
      {
        name: 'Recipient Z',
        email: 'recipientz@example.com',
        password: 'password123',
        role: 'recipient',
        phone: '5555555553',
        city: 'Delhi',
      },
    ];

    // Using create so pre-save hook runs for passwords
    for (const user of users) {
      await User.create(user);
    }

    console.log('Database Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
