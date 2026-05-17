const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
    
    // Find the donor user from the screenshot (Jeevan B N) or any user
    const user = await User.findOne();
    if (!user) {
      console.log("No user found");
      process.exit(1);
    }

    console.log("Found user:", user.email, "without modifying anything.");
    
    user.location = {
      lat: Number(12.34) || null,
      lng: Number(56.78) || null
    };

    console.log("Saving user...");
    await user.save({ validateModifiedOnly: true });
    console.log("Success!");
    process.exit(0);
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:");
    console.error(error);
    process.exit(1);
  }
}
test();
