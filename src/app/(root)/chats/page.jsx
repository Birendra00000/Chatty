"use client";
import { useSession } from "next-auth/react";
import React from "react";
import ChatList from "../../components/ChatList";
import Contact from "../../components/Contact";

const Chats = () => {
  const { data: session } = useSession();
  console.log("session", session);

  return (
    <div className="w-full flex">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <ChatList />
      </div>
      <div className="w-2/3 max-lg:w-1/2 max-md:hidden">
        <Contact />
      </div>
    </div>
  );
};

export default Chats;
