"use client";
import { format } from "date-fns";
import React from "react";
import { useRouter } from "next/navigation";

const ChatBox = ({ chats, currentUser, index, currentChatId }) => {
  const otherMembers = Array.isArray(chats?.members)
    ? chats.members.filter((item) => item._id === currentUser._id)
    : [];

  // Fallback image paths for better error handling
  const groupImage = chats.groupPhoto || "/assests/group.jpg";
  const memberImage = otherMembers[0]?.profileImage || "/assets/user.png";
  const memberName = otherMembers[0]?.username;

  const lastMessages =
    chats?.message?.length > 0 && chats?.message[chats?.message.length - 1];

  console.log("lastMessages", lastMessages);

  const seen = lastMessages?.seenBy?.find(
    (member) => member._id === currentUser._id
  );

  const router = useRouter();

  return (
    <div
      className={`p-2 cursor-pointer ${
        chats._id === currentChatId ? "bg-gray-100 rounded-md" : ""
      }`}
      onClick={() => router.push(`/chats/${chats._id}`)}
    >
      <div className="flex justify-between ">
        <div className="flex gap-6">
          {chats?.isGroup ? (
            <>
              <img
                src={groupImage}
                alt="group"
                className="w-[40px] h-[40px] rounded-full"
              />
            </>
          ) : (
            <>
              <img
                src={memberImage}
                alt="member"
                className="w-[40px] h-[40px] rounded-full"
              />
            </>
          )}
          <div>
            <div>
              {chats.isGroup ? (
                <p>{chats?.name || "Groupchat"}</p>
              ) : (
                <p>{memberName}</p>
              )}
            </div>
            {!lastMessages && <p>Started a chat</p>}
            {lastMessages?.photo ? (
              lastMessages?.sender?._id === currentUser._id ? (
                <p>You sent a photo</p>
              ) : (
                <p className={`${seen ? "text-black" : "text-blue-700"}`}>
                  {" "}
                  Received a Photo
                </p>
              )
            ) : (
              <p
                className={`text-ellipsis overflow-hidden w-[200px] ${
                  seen ? "text-black" : "text-blue-700"
                }`}
              >
                {lastMessages.text}
              </p>
            )}
          </div>
        </div>
        <div>
          {!lastMessages
            ? format(new Date(chats?.createdAt), "p")
            : format(new Date(chats?.lastMessage), "p")}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
