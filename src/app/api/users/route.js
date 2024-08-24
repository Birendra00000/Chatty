import User from "../../../../modals/User";
import { connecttoDB } from "../../../../mongoose";

export const GET = async () => {
  try {
    await connecttoDB();

    const allusersGet = await User.find();

    return new Response(JSON.stringify(allusersGet, { status: 200 }));
  } catch (error) {
    return new Response("Failed to load all user", { status: 500 });
  }
};
