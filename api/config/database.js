import mongoose from 'mongoose';

const connectDB = async (uri = process.env.MONGODB_URI) => {
  try {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    };

    await mongoose.connect(uri, connectionOptions);
    console.log('Database connected');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
