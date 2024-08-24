const { default: Chat } = require("../../../../modals/Chat");
const { default: User } = require("../../../../modals/User");
const { connecttoDB } = require("../../../../mongoose");

export const POST = async (req) => {
  try {
    await connecttoDB();

    const body = await req.json();
    const { currentUserId, members, isGroup, name, groupPhoto } = body;
    console.log(body);
    // Validate members
    if (!Array.isArray(members)) {
      throw new Error("members should be an array");
    }

    //Define query to find the chat

    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );

      await chat.save();

      const updateAllMembers = chat.members.map(async (memberId) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      Promise.all(updateAllMembers);
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new chat", { status: 400 });
  }
};
