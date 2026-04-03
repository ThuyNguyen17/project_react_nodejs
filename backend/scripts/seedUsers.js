require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const Teacher = require('../src/models/Teacher');
const Student = require('../src/models/Student');

async function upsertUser(username, role, plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, 10);

  const user = await User.findOneAndUpdate(
    { username },
    {
      $set: {
        username,
        role,
        password: hashed,
        isActive: true
      }
    },
    { new: true, upsert: true }
  );

  return user;
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in .env');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const admin = await upsertUser('admin1', 'ADMIN', '123456');
  const teacherUser = await upsertUser('teacher1', 'TEACHER', '123456');
  const studentUser = await upsertUser('student1', 'STUDENT', '123456');

  await Teacher.findOneAndUpdate(
    { teacherCode: 'teacher1' },
    {
      $set: {
        userId: String(teacherUser._id),
        teacherCode: 'teacher1',
        fullName: 'Teacher One',
        email: 'teacher1@example.com'
      }
    },
    { new: true, upsert: true }
  );

  await Student.findOneAndUpdate(
    { studentCode: 'student1' },
    {
      $set: {
        userId: String(studentUser._id),
        studentCode: 'student1',
        fullName: 'Student One',
        contact: {
          email: 'student1@example.com'
        }
      }
    },
    { new: true, upsert: true }
  );

  console.log('Seeded accounts successfully:');
  console.log(`- ADMIN   : admin1 / 123456 (userId: ${admin._id})`);
  console.log(`- TEACHER : teacher1 / 123456 (userId: ${teacherUser._id})`);
  console.log(`- STUDENT : student1 / 123456 (userId: ${studentUser._id})`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
