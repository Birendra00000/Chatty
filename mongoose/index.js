import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Ensure this is called at the beginning
let isConnected = false;

export const connecttoDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  // console.log("MONGODB_URL is thisssssssssssss", process.env.MONGODB_URL);
  // console.log("MONGODB_URL", process.env.MONGODB_URL); // Log the environment variable
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB is connected successfully!");
  } catch (error) {
    console.error("Error while connecting to the database:", error);
  }
};
