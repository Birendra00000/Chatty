import { pusherServer } from "../../../../Lib/Pusher";
import Chat from "../../../../modals/Chat";
import Message from "../../../../modals/Message";
import User from "../../../../modals/User";
import { connecttoDB } from "../../../../mongoose";

export const POST = async (req) => {
  try {
    await connecttoDB();
    const body = await req.json();
    const { chatId, currentUserId, text, photo } = body;

    // if (!chatId || !currentUserId || !text) {
    //   return new Response(
    //     JSON.stringify({ error: "Missing required fields" }),
    //     { status: 400 }
    //   );
    // }
    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { message: newMessage._id },
      },
      {
        $set: { lastMessage: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "message",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    // trigger a Pusher event for a specific chat abpot the new message

    await pusherServer.trigger(chatId, "new-message", newMessage);

    //Triggers a pusher event for each member of the chat update with the latest message

    const lastmessage = updatedChat?.message[updatedChat?.message.length - 1];

    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          message: [lastmessage],
        });
      } catch (error) {
        console.log(error);
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.log("Failed to trigger update-chat event", error);
    return new Response("Failed to send message", { status: 500 });
  }
};
