import Chat from "../../../../../../modals/Chat";
import { connecttoDB } from "../../../../../../mongoose";

export const POST = async (req, { params }) => {
  try {
    await connecttoDB();
    const body = await req.json();
    console.log(body);
    const { chatId } = params;
    console.log("Params:", chatId);
    console.log("Request body:", body);

    if (!chatId) {
      return new Response("Chat ID is required", { status: 400 });
    }
    const { name, groupPhoto } = body;
    if (!name || !groupPhoto) {
      return new Response("Name and photo is required", { status: 400 });
    }
    const updatedGroupProfile = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true, runValidators: true }
    );
    if (!updatedGroupProfile) {
      return new Response("Chat not found", { status: 404 });
    }
    return new Response(JSON.stringify(updatedGroupProfile), {
      status: 200,
      headers: { "Content-Type": "application/json" }, // Ensure correct content type
    });
  } catch (error) {
    console.error("Error updating group chat info:", error); // Log the error for debugging
    return new Response("Failed to update group chat info", { status: 400 });
  }
};
