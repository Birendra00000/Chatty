"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import ChatBox from "./ChatBox";

const ChatList = ({ currentChatId }) => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const response = await axios.get(
        search !== ""
          ? `/api/users/${currentUser._id}/searchChat/${search}`
          : `/api/users/${currentUser._id}`
      );
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search chat ......"
        className="p-2 w-full rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="bg-white mt-5 flex flex-col justify-center items-center">
        <div className="w-[88%] mt-2 mb-2">
          {" "}
          {chats &&
            chats.map((item, index) => {
              return (
                <ChatBox
                  chats={item}
                  index={index}
                  currentUser={currentUser}
                  currentChatId={currentChatId}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
