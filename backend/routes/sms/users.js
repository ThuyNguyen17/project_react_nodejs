const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { getModel } = require('../../models/dynamicModel');

const router = express.Router();
const User = getModel('users');
const Student = getModel('students');
const Teacher = getModel('teachers');

const verifyPassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) return false;
  const isHash = typeof storedPassword === 'string' && /^\$2[aby]\$/.test(storedPassword);
  if (isHash) {
    return bcrypt.compare(plainPassword, storedPassword);
  }
  return plainPassword === storedPassword;
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = {
    $or: [
      { username },
      { email: username },
      { code: username },
      { studentCode: username },
      { name: username }
    ]
  };
  
  let candidate = await User.findOne(query);
  if (!candidate) candidate = await Student.findOne(query);
  if (!candidate) candidate = await Teacher.findOne(query);

  if (!candidate) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isValid = await verifyPassword(password, candidate.password);
  if (!isValid) {
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

module.exports = router;
