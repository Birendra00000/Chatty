import Chat from "../../../../../../../modals/Chat";
import Message from "../../../../../../../modals/Message";
import User from "../../../../../../../modals/User";
import { connecttoDB } from "../../../../../../../mongoose";

export const GET = async (req, { params }) => {
  try {
    await connecttoDB();
    const { userId, query } = params;
    console.log("Received parameters:", params);
    console.log("User ID:", params.userId);
    console.log("Query:", params.query);

    const searchChat = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "message",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();
    return new Response(JSON.stringify(searchChat), { status: 200 });
  } catch (error) {
    return new Response("Failed to seach chat", { status: 500 });
  }
};
