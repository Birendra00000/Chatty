"use client";
import React from "react";
import ChatDetails from "../../../components/ChatDetails";
import ChatList from "../../../components/ChatList";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
const chatPage = () => {
  const { chatId } = useParams();

  const { data: session } = useSession();
  const currentUser = session?.user;

  return (
    <div className="w-full flex justify-center">
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
