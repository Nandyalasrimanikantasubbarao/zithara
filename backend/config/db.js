import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("successfully connected mongodb 😊");
  } catch (err) {
    console.error();
  }
};

export default connectDB;
