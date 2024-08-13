import mongoose from "mongoose";

let isConnected = false;

export const connecttoDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Chatty",
      useNewUrlParser: true,
      uneUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Mongo DB is connected successfully!!");
  } catch (error) {
    console.log("Error while connecting with database", error);
  }
};
