import Chat from "../../../../../modals/Chat";
import User from "../../../../../modals/User";
import { connecttoDB } from "../../../../../mongoose";

export const GET = async (req, { params }) => {
  try {
    await connecttoDB();

    const { userId } = params;
    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }
    const allChats = await Chat.find({ members: userId })
      .sort({ lastMessageAt: -1 })
      .populate("members")
      .exec();

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response("Failed to get all chats of current User", {
      status: 500,
    });
  }
};
