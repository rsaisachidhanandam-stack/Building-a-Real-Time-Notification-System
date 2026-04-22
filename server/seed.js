const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/beathub');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create admin
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@beathub.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('✅ Admin User Created:', adminUser.email);
    
    // Create regular user
    const regularUser = await User.create({
      username: 'user',
      email: 'user@beathub.com',
      password: 'password123',
      role: 'user'
    });
    console.log('✅ Regular User Created:', regularUser.email);

    // Create some songs for analytics
    const Song = require('./models/Song');
    await Song.deleteMany({});
    await Song.create([
      { title: 'Shake It Off', artist: 'Taylor Swift', duration: 219 },
      { title: 'Blank Space', artist: 'Taylor Swift', duration: 231 },
      { title: 'Gods Plan', artist: 'Drake', duration: 198 },
      { title: 'One Dance', artist: 'Drake', duration: 200 }
    ]);
    console.log('✅ Songs Seeded for Analytics');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedUsers();
