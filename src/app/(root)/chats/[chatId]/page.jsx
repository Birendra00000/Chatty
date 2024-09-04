"use client";
import React, { useEffect } from "react";
import ChatDetails from "../../../components/ChatDetails";
import ChatList from "../../../components/ChatList";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

const chatPage = () => {
  const { chatId } = useParams();

  const { data: session } = useSession();
  const currentUser = session?.user;
  console.log("currentUser", currentUser);

  const seenMessages = async () => {
    try {
      await axios.post(
        `/api/chats/${chatId}`,
        { currentUserId: currentUser._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log("There is an error", err);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) seenMessages();
  }, [currentUser, chatId]);

  return (
    <div className="w-full flex justify-center mt-[2%]">
      <div className="w-11/12 flex">
        <div className="w-1/3 max-lg:hidden">
          <ChatList currentChatId={chatId} />
        </div>
        <div className="w-2/3 max-lg:w-full">
          <ChatDetails chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default chatPage;
