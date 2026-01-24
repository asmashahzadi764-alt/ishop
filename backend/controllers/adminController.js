// backend/controllers/adminController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendEmailResend } from "../utils/sendEmailResend.js";

// -----------------------
// 🔹 JWT Token Generator
// -----------------------
const signToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email, username: admin.username, isAdmin: admin.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

// -----------------------
// 🔹 Admin Login
// -----------------------
export const loginAdmin = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    console.log('loginAdmin called with:', { emailOrUsername: emailOrUsername && String(emailOrUsername).slice(0,100) });
    // Basic input validation
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Build query safely: only call toLowerCase when value is a string
    const search = {};
    const usernameQuery = { username: emailOrUsername };
    const emailQuery = typeof emailOrUsername === 'string' ? { email: emailOrUsername.toLowerCase() } : null;
    const orQueries = emailQuery ? [usernameQuery, emailQuery] : [usernameQuery];

    let admin = await Admin.findOne({ $or: orQueries });
    console.log('loginAdmin: admin found?', !!admin);

    if (!admin) {
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }

    // Log whether a password hash exists for debugging
    try {
      console.log('loginAdmin: admin.email=', admin.email, 'passwordExists=', !!admin.password, 'passwordType=', typeof admin.password);
    } catch (logErr) {
      console.error('Failed to log admin debug info:', logErr);
    }

    let isMatch = false;
    // Prefer instance method when available; otherwise fall back to bcrypt.compare against stored hash
    // Diagnostic: log prototype info so we can see if methods are attached
    try {
      console.log('loginAdmin: admin.constructor.modelName=', admin && admin.constructor && admin.constructor.modelName);
      console.log('loginAdmin: prototype keys=', admin && Object.getOwnPropertyNames(Object.getPrototypeOf(admin)));
    } catch (protoErr) {
      console.warn('loginAdmin: failed to inspect admin prototype', protoErr && protoErr.message);
    }

    // If the instance method is missing, try to rehydrate the document (safeguard against lean/plain-object cases)
    if (typeof admin.comparePassword !== 'function') {
      try {
        console.warn('loginAdmin: comparePassword not found on returned admin — attempting to rehydrate via findById');
        const rehydrated = await Admin.findById(admin._id);
        if (rehydrated && typeof rehydrated.comparePassword === 'function') {
          console.log('loginAdmin: rehydration successful, using rehydrated document');
          admin = rehydrated;
        } else {
          console.warn('loginAdmin: rehydration did not yield instance methods; will fall back to bcrypt.compare');
        }
      } catch (rehydrateErr) {
        console.error('loginAdmin: rehydration error', rehydrateErr && rehydrateErr.stack);
      }
    }

    if (typeof admin.comparePassword === 'function') {
      try {
        console.log('loginAdmin: using admin.comparePassword method');
        isMatch = await admin.comparePassword(password);
        console.log('loginAdmin: password match?', !!isMatch);
      } catch (compareErr) {
        console.error('loginAdmin: error during admin.comparePassword:', compareErr && (compareErr.stack || compareErr));
        return res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'production' ? undefined : String(compareErr && compareErr.message) });
      }
    } else {
      try {
        console.warn('loginAdmin: admin.comparePassword not available; falling back to bcrypt.compare on stored hash');
        const stored = String(admin.password || '');
        console.log('loginAdmin: stored password present:', !!stored);

        const looksHashed = /^\$2[aby]\$/.test(stored);
        if (!looksHashed) {
          console.warn('loginAdmin: stored password does not appear to be a bcrypt hash (legacy/plaintext).');
          if (stored === password) {
            try {
              // Reassign and save so pre-save hook hashes the password
              admin.password = password;
              admin.markModified('password');
              await admin.save();
              isMatch = true;
              console.log('loginAdmin: plaintext matched and password re-hashed successfully');
            } catch (saveErr) {
              console.error('loginAdmin: failed to re-hash plaintext password during login:', saveErr && (saveErr.stack || saveErr));
              return res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'production' ? undefined : String(saveErr && saveErr.message) });
            }
          } else {
            isMatch = false;
          }
        } else {
          isMatch = await bcrypt.compare(password, stored);
          console.log('loginAdmin (bcrypt.compare fallback): password match?', !!isMatch);
        }
      } catch (bcryptErr) {
        console.error('loginAdmin: bcrypt.compare fallback error:', bcryptErr && (bcryptErr.stack || bcryptErr));
        return res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'production' ? undefined : String(bcryptErr && bcryptErr.message) });
      }
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment');
      return res.status(500).json({ message: 'Server configuration error (missing JWT secret)' });
    }

    const token = signToken(admin);
    res.json({ message: 'Login successful', token, admin: { username: admin.username, email: admin.email } });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------
// 🔹 Get Dashboard Counts
// -----------------------
export const getCounts = async (req, res) => {
  try {
    // Lazy import models to avoid circular deps
    const Product = (await import('../models/Product.js')).default;
    const Contact = (await import('../models/Contact.js')).default;
    const Admin = (await import('../models/Admin.js')).default;

    const [totalProducts, totalMessages, totalAdmins] = await Promise.all([
      Product.countDocuments(),
      Contact.countDocuments(),
      Admin.countDocuments(),
    ]);

    res.json({ totalProducts, totalMessages, totalAdmins });
  } catch (err) {
    console.error('Get counts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// -----------------------
// 🔹 DEV: List Admins (emails + usernames) - development only
// -----------------------
export const listAdmins = async (req, res) => {
  try {
    // Include _id so we can correlate records during debugging
    const admins = await Admin.find({}, { email: 1, username: 1, _id: 1 }).lean();
    res.json({ admins });
  } catch (err) {
    console.error('listAdmins error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// -----------------------
// 🔹 DEV: Return full admin doc (development only)
// -----------------------
export const getAdminDev = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not allowed in production' });
  }

  const { email } = req.params;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).lean({ virtuals: false });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    // Return admin doc including password hash (dev only) so we can inspect stored fields
    res.json({ admin });
    } catch (err) {
    console.error('getAdminDev error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// -----------------------
export const createAdminDev = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not allowed in production' });
  }

  const { email, password, username } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(200).json({ message: 'Admin already exists', email: existing.email });

    const admin = new Admin({ username: username || 'admin', email: email.toLowerCase().trim(), password, isAdmin: true });
    await admin.save();
    res.json({ message: 'Admin created', email: admin.email });
  } catch (err) {
    console.error('createAdminDev error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// -----------------------
// 🔹 DEV: Check login lookup + password compare (development only)
// -----------------------
export const checkLoginDev = async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed in production' });
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) return res.status(400).json({ message: 'emailOrUsername and password are required' });

  try {
    const usernameQuery = { username: emailOrUsername };
    const emailQuery = typeof emailOrUsername === 'string' ? { email: emailOrUsername.toLowerCase() } : null;
    const orQueries = emailQuery ? [usernameQuery, emailQuery] : [usernameQuery];

    const admin = await Admin.findOne({ $or: orQueries });
    if (!admin) return res.json({ found: false, message: 'Admin not found' });
    // Diagnostic: inspect prototype and constructor name
    try {
      console.log('checkLoginDev: admin.constructor.modelName=', admin && admin.constructor && admin.constructor.modelName);
      console.log('checkLoginDev: prototype keys=', admin && Object.getOwnPropertyNames(Object.getPrototypeOf(admin)));
    } catch (protoErr) {
      console.warn('checkLoginDev: failed to inspect admin prototype', protoErr && protoErr.message);
    }

    // Ensure we have a proper Mongoose document with instance methods; try rehydration if not
    let hasMethod = typeof admin.comparePassword === 'function';
    if (!hasMethod) {
      try {
        console.warn('checkLoginDev: comparePassword not present, attempting rehydrate via findById');
        const rehydrated = await Admin.findById(admin._id);
        if (rehydrated) {
          admin = rehydrated; // reassign to the rehydrated document
          hasMethod = typeof admin.comparePassword === 'function';
          console.log('checkLoginDev: rehydration success, hasMethod=', hasMethod);
        }
      } catch (rehydrateErr) {
        console.error('checkLoginDev: rehydration error', rehydrateErr && rehydrateErr.stack);
      }
    }

    let compareResult = null;
    try {
      if (hasMethod) {
        compareResult = await admin.comparePassword(password);
      } else {
        // Handle legacy/plaintext stored passwords similarly to login flow
        const stored = String(admin.password || '');
        const looksHashed = /^\$2[aby]\$/.test(stored);
        if (!looksHashed) {
          console.warn('checkLoginDev: stored password is not hashed (legacy/plaintext).');
          if (stored === password) {
            try {
              admin.password = password;
              admin.markModified('password');
              await admin.save();
              compareResult = true;
              console.log('checkLoginDev: plaintext matched and was re-hashed');
            } catch (saveErr) {
              console.error('checkLoginDev: failed to re-hash plaintext password:', saveErr && (saveErr.stack || saveErr));
              return res.status(500).json({ message: 'Server error', error: String(saveErr && saveErr.message) });
            }
          } else {
            compareResult = false;
          }
        } else {
          compareResult = await bcrypt.compare(password, stored);
        }
      }
    } catch (err) {
      console.error('checkLoginDev: compare error', err && (err.stack || err));
      return res.status(500).json({ message: 'Compare error', error: String(err && err.message) });
    }

    return res.json({ found: true, id: admin._id, email: admin.email, username: admin.username, hasMethod, compareResult });
  } catch (err) {
    console.error('checkLoginDev error:', err);
    return res.status(500).json({ message: 'Server error', error: String(err && err.message) });
  }
};

// -----------------------
// 🔹 DEV: Reset admin password by email (development only)
// -----------------------
export const resetAdminDev = async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed in production' });
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: 'email and newPassword are required' });

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.password = newPassword; // pre-save hook will hash
    await admin.save();
    return res.json({ message: 'Password reset', email: admin.email });
  } catch (err) {
    console.error('resetAdminDev error:', err);
    return res.status(500).json({ message: 'Server error', error: String(err && err.message) });
  }
};

// -----------------------
// 🔹 DEV: Find all admins by email (development only)
export const findAdminsByEmailDev = async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed in production' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'email is required' });

  try {
    // Return full docs (including password hash) for debugging
    const admins = await Admin.find({ email: email.toLowerCase().trim() });
    if (!admins || admins.length === 0) return res.status(404).json({ message: 'No admins found' });

    // Map to safe debug representation
    const result = admins.map(a => ({ _id: a._id, email: a.email, username: a.username, password: a.password, createdAt: a.createdAt, updatedAt: a.updatedAt }));
    return res.json({ count: result.length, admins: result });
  } catch (err) {
    console.error('findAdminsByEmailDev error:', err && (err.stack || err));
    return res.status(500).json({ message: 'Server error', error: String(err && err.message) });
  }
};
