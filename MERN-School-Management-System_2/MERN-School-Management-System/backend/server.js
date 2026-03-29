import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/db.js';
import studentsRouter from './routes/students.js';
import usersRouter from './routes/users.js';
import genericRouter from './routes/genericResource.js';
import attendanceRouter from './routes/attendance.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school-management';

// Debug: Log the MongoDB URI being used
console.log('[DEBUG] MONGODB_URI from env:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('[DEBUG] Using mongoUri:', mongoUri.replace(/:([^:@]+)@/, ':****@')); // Hide password

await connectDatabase(mongoUri);

app.use('/api/students', studentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/v1', genericRouter);
app.use('/api/attendance', attendanceRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Node backend is running.' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Backend Node server listening on port ${port}`);
});
