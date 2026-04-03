const mongoose = require('mongoose');

const resolveDbName = () => {
  try {
    const mongoUrl = new URL(process.env.MONGODB_URI);
    const pathName = (mongoUrl.pathname || '').replace(/^\//, '').trim();
    return pathName || 'project_management_class';
  } catch (error) {
    return 'project_management_class';
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: resolveDbName()
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
