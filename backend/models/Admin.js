import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema(
  {
    code: String,
    expiresAt: Date,
  },
  { _id: false }
);

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    otp: otpSchema,
  },
  { timestamps: true }
);

// Hash password before save
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Compare plaintext password with hashed
adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Convenience method to set OTP (hashes stored code)
adminSchema.methods.setOTP = async function (plainOTP, ttlMinutes = 10) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainOTP, salt);
  this.otp = { code: hashed, expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000) };
  await this.save();
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;
