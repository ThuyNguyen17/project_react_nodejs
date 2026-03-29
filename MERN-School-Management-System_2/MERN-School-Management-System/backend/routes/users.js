import express from 'express';
import bcrypt from 'bcryptjs';
import { getModel } from '../models/dynamicModel.js';
import mongoose from 'mongoose';

const router = express.Router();
const User = getModel('users');
const Student = getModel('students');
const Teacher = getModel('teachers');

// Debug: Log database connection info
console.log('[DEBUG] Database name:', mongoose.connection.db?.databaseName || 'Not connected');
console.log('[DEBUG] Collections available:', Object.keys(mongoose.connection.collections || {}));

// Password verification helper
const verifyPassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) return false;
  const isHash = typeof storedPassword === 'string' && /^\$2[aby]\$/.test(storedPassword);
  if (isHash) {
    return bcrypt.compare(plainPassword, storedPassword);
  }
  return plainPassword === storedPassword;
};

// Login endpoint - searches across User, Student, and Teacher collections
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log('[DEBUG] Login attempt - username:', username);
  
  // Debug: Count documents in each collection
  try {
    const userCount = await User.countDocuments();
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    console.log('[DEBUG] Collection counts - users:', userCount, 'students:', studentCount, 'teachers:', teacherCount);
    
    // List all users
    const allUsers = await User.find().limit(5);
    console.log('[DEBUG] Sample users:', allUsers.map(u => ({ username: u.username, email: u.email, name: u.name })));
    
    // List all students to verify data exists
    const allStudents = await Student.find().limit(5);
    console.log('[DEBUG] Sample students:', allStudents.map(s => ({ studentCode: s.studentCode, name: s.name || s.fullName })));
    
    // Check database name
    console.log('[DEBUG] Connected database:', mongoose.connection.db.databaseName);
  } catch (e) {
    console.log('[DEBUG] Error counting:', e.message);
  }
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Search for user in User, Student, or Teacher collections
  const query = {
    $or: [
      { username },
      { email: username },
      { code: username },
      { studentCode: username },
      { name: username }
    ]
  };
  
  console.log('[DEBUG] Query:', JSON.stringify(query));

  let candidate = await User.findOne(query);
  console.log('[DEBUG] User.findOne result:', candidate ? 'found (password: ' + !!candidate.password + ')' : 'not found');
  
  if (!candidate) candidate = await Student.findOne(query);
  console.log('[DEBUG] Student.findOne result:', candidate ? 'found (password: ' + !!candidate.password + ')' : 'not found');
  if (candidate && !candidate.password) {
    console.log('[DEBUG] Student document fields:', Object.keys(candidate.toObject()));
  }
  
  if (!candidate) candidate = await Teacher.findOne(query);
  console.log('[DEBUG] Teacher.findOne result:', candidate ? 'found (password: ' + !!candidate.password + ')' : 'not found');

  if (!candidate) {
    console.log('[DEBUG] No user found in any collection');
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isValid = await verifyPassword(password, candidate.password);
  if (!isValid) {
    console.log('[DEBUG] Password verification failed for:', candidate.username || candidate.studentCode);
    console.log('[DEBUG] Stored password exists:', !!candidate.password);
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const data = candidate.toObject();
  const role = data.role || data.userRole || data.type || 'USER';
  
  res.json({
    ...data,
    role,
    userId: data._id,
    teacherId: data.teacherId || undefined
  });
});

router.post('/register-admin', async (req, res) => {
  const { password, ...rest } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const payload = {
    ...rest,
    role: 'ADMIN',
    password: hashedPassword || undefined
  };
  const user = new User(payload);
  await user.save();
  res.status(201).json({ ...user.toObject(), password: undefined });
});

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Debug endpoint to list all users (without passwords)
router.get('/debug/list-all', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const students = await Student.find().select('-password');
    const teachers = await Teacher.find().select('-password');
    res.json({
      users: users.map(u => ({ username: u.username, email: u.email, name: u.name || u.fullName, role: u.role })),
      students: students.map(s => ({ studentCode: s.studentCode, name: s.name || s.fullName, email: s.email })),
      teachers: teachers.map(t => ({ code: t.code || t.teacherCode, name: t.name || t.fullName, email: t.email }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
