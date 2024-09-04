"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { RiGalleryView } from "react-icons/ri";
import { LuSendHorizonal } from "react-icons/lu";
import { CldUploadButton } from "next-cloudinary";
import MessageBox from "./MessageBox";
import { pusherClient } from "../../../Lib/Pusher";

const ChatDetails = ({ chatId }) => {
  const [text, sendText] = useState("");
  const [loading, setLoading] = useState("");
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);

  const { data: session } = useSession();
  const currentUser = session?.user;

  const getChatDetails = async () => {
    try {
      const response = await axios.get(`/api/chats/${chatId}`);
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

  //FOR SENDING CHAT MESSAGE
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

      if (response.status !== 200) {
        console.log("Something went wrong");
      } else {
        sendText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //FOR SENDING PHOTO

  const sendPhoto = async (result) => {
    // console.log("Upload Result:", result); // Inspect result structure
    try {
      const response = await axios.post(
        "/api/messages",
        {
          chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("response", chatId, photo);

      if (response.status !== 200) {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //For pusher

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = (newMessage) => {
      setChat((preChat) => {
        return {
          ...preChat,
          message: [...preChat.message, newMessage],
        };
      });
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId]);

  //For scrolling bottom when having new message into message box

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.message]);

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
                  className="w-[40px] h-[40px] rounded-full mr-1"
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
        <div className=" h-[400px] bg-slate-100 overflow-x-auto p-4">
          {chat?.message?.map((chatMessage) => (
            <MessageBox chatMessage={chatMessage} currentUser={currentUser} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div>
          <div className="relative">
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onUpload={sendPhoto}
              uploadPreset="vtenqo0l"
            >
              <RiGalleryView
                className="absolute top-[20%] left-[1%] cursor-pointer"
                size={25}
              />
            </CldUploadButton>
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
