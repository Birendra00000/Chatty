import User from "../../../../../../modals/User";
import { connecttoDB } from "../../../../../../mongoose";

export const PUT = async (req, { params }) => {
  try {
    await connecttoDB();

    const { userId } = params;

    const body = await req.json();

    const { username, profileImage } = body;

    const updateUserProfile = await User.findByIdAndUpdate(
      userId,
      {
        username,
        profileImage,
      },
      {
        new: true,
      }
    );
    return new Response(JSON.stringify(updateUserProfile), {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Ensure the response content type is JSON
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Failed to get all chats of current User" }),
      { status: 500 }
    );
  }
};
