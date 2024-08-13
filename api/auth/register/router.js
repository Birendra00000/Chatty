import User from "../../../modals/User";
import { connecttoDB } from "../../../mongoose";

export const register = async (req, res) => {
  try {
    await connecttoDB();

    const body = await req.json();

    const { username, email, password } = req.body;

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return new Response("User already Exist", {
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
