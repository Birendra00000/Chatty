import User from "../../../../../modals/User";
import { hash } from "bcryptjs";
import { connecttoDB } from "../../../../../mongoose";
import bcrypt from "bcryptjs";

export const POST = async (req, res) => {
  try {
    await connecttoDB();

    const body = await req.json();

    const { username, email, password } = body;

    console.log(req.body.username);
    // return new Response("Failed to create a new user", {
    //     status: 500,
    //   }

    if (!username || !email || !password) {
      return new Response("Pleased provide username,email and password", {
        status: 400,
      });
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return new Response("Email already exist", {
        status: 400,
      });
    }

    const hashPassword = await bcrypt.hash(password, 6);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a user", { status: 500 });
  }
};
