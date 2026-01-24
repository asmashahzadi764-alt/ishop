import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ishop';

async function run() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for inspection');

    const email = process.argv[2] || 'asmashahzadi2007@gmail.com';
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      console.log('Admin not found for', email);
      process.exit(0);
    }

    console.log('Admin raw (toString):', String(admin));
    console.log('Admin JSON:', JSON.stringify(admin.toObject ? admin.toObject() : admin, null, 2));
    console.log('comparePassword typeof:', typeof admin.comparePassword);
    try {
      console.log('comparePassword isOwnProperty on prototype:', Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(admin), 'comparePassword'));
    } catch (e) {
      console.log('failed prototype check', e);
    }

    // Try calling comparePassword safely (catch errors)
    try {
      const ok = await admin.comparePassword('Asma@2007');
      console.log('comparePassword test result (Asma@2007):', ok);
    } catch (err) {
      console.error('comparePassword threw error:', err && err.stack ? err.stack : err);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Inspection failed:', err && err.stack ? err.stack : err);
    process.exit(2);
  }
}

run();
