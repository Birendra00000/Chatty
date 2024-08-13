import mongoose from "mongoose";

const userSchema = new mongoose.Shema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  chats: {
    type: [{ type: mongoose.Shema.Types.ObjectId, ref: "Chat" }],
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
