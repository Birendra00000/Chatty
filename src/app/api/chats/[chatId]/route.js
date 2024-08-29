import Message from "../../../../../modals/Message";

const { default: Chat } = require("../../../../../modals/Chat");
const { default: User } = require("../../../../../modals/User");
const { connecttoDB } = require("../../../../../mongoose");

export const GET = async (req, { params }) => {
  try {
    await connecttoDB();

    const { chatId } = params;
    console.log("Received parameters:", params);
    console.log("Query:", params.chatId);

    const chat = await Chat.findById(chatId)
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

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get chat details", { status: 400 });
  }
};
