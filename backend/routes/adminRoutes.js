import express from "express";
import {
  loginAdmin,
  getCounts,
  listAdmins,
  createAdminDev,
  getAdminDev,
  checkLoginDev,
  findAdminsByEmailDev,
  resetAdminDev,
} from "../controllers/adminController.js";

const router = express.Router();

// Login
router.post("/login", loginAdmin);

// Health check for admin backend
router.get('/health', (req, res) => res.json({ ok: true, service: 'admin-backend' }));

// Dashboard counts
router.get("/counts", getCounts);

// DEV: list admins
// DEV debug: list admins in DB
router.get('/debug/admins', listAdmins);

// DEV: create admin via HTTP (development only)
router.post('/debug/create', createAdminDev);

// DEV: inspect admin doc (development only)
router.get('/debug/admin/:email', getAdminDev);

// DEV: find all admin docs matching an email (development only)
router.post('/debug/find-by-email', findAdminsByEmailDev);

// DEV: check lookup and password compare
router.post('/debug/check', checkLoginDev);

// DEV: reset admin password (development only)
router.post('/debug/reset', resetAdminDev);

export default router;
