"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import ChatBox from "./ChatBox";
import { pusherClient } from "../../../Lib/Pusher";

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

  //For updating any new chat

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, message: updatedChat.message };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search chat ......"
        className="p-2 w-full rounded-md outline-none"
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
                  key={item._id}
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
