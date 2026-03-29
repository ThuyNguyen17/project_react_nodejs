import mongoose from 'mongoose';

const connectDatabase = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'project_management_class'  // Force database name
    });
    console.log('Connected to MongoDB');
    console.log('[DEBUG] Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDatabase;
