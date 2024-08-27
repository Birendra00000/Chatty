"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RiGalleryView } from "react-icons/ri";
import { LuSendHorizonal } from "react-icons/lu";

const ChatDetails = ({ chatId }) => {
  const [text, sendText] = useState("");
  const [loading, setLoading] = useState("");
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);

  const { data: session } = useSession();
  const currentUser = session?.user;
  console.log("otherMember", otherMembers);

  const getChatDetails = async () => {
    try {
      const response = await axios.get(`/api/chats/${chatId}`);
      console.log("ResponseDetails", response);
      setChat(response.data);
      setOtherMembers(
        response?.data?.members?.filter(
          (member) => member._id !== currentUser._id
        )
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) {
      getChatDetails();
    }
  }, [currentUser, chatId]);

  const sendChat = async () => {
    try {
      const response = await axios.post(
        "/api/messages",
        { chatId, currentUserId: currentUser._id, text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);

      if (response.status !== 200) {
        console.log("Something went wrong");
      } else {
        sendText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[90%] ">
        <div className="flex justify-center bg-white ">
          {chat?.isGroup ? (
            <>
              <Link
                href={`/chats/${chatId}/group-info`}
                className="flex items-center p-2 rounded-md w-[95%]"
              >
                <img
                  src={chat.groupPhoto || "/assests/group.jpg"}
                  alt="group"
                  className="w-[40px] h-[40px] rounded-full"
                />
                <div>
                  <p>
                    {chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                    members
                  </p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/chats/${chatId}/group-info`}
                className="flex items-center p-2 rounded-md w-[95%] gap-3"
              >
                <img
                  src={otherMembers[0]?.profileImage || "/assests/person.jpg"}
                  alt="profile photo"
                  className="w-[40px] h-[40px] rounded-full"
                />
                <div className="text">
                  <p>{otherMembers[0]?.username}</p>
                </div>
              </Link>
            </>
          )}
        </div>
        <div>Chatbody</div>

        <div>
          <div className="relative">
            <RiGalleryView
              className="absolute top-[20%] left-[1%] cursor-pointer"
              size={25}
            />
            <input
              type="text"
              placeholder="Write a message"
              value={text}
              onChange={(e) => sendText(e.target.value)}
              className="p-2 pl-14 outline-none w-full"
            />
            <span onClick={sendChat}>
              <LuSendHorizonal
                size={25}
                className="absolute right-[2%] top-[20%] cursor-pointer "
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
