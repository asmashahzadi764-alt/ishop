import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ishop';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--email') { out.email = args[i + 1]; i++; }
    else if (a === '--password') { out.password = args[i + 1]; i++; }
    else if (a === '--username') { out.username = args[i + 1]; i++; }
  }
  return out;
}

const { email, password, username } = parseArgs();

if (!email || !password) {
  console.error('Usage: node createAdmin.js --email <email> --password <password> [--username <username>]');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB for admin creation');

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      return process.exit(0);
    }

    const admin = new Admin({
      username: username || 'admin',
      email: email.toLowerCase().trim(),
      password,
      isAdmin: true,
    });

    await admin.save();
    console.log('✅ Admin created:', admin.email);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exit(1);
  }
}

main();
