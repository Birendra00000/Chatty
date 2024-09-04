"use client";
import React from "react";
import { format } from "date-fns";

const MessageBox = ({ chatMessage, currentUser }) => {
  //   console.log("chatMessage", chatMessage);
  return (
    <>
      {chatMessage?.sender._id !== currentUser._id ? (
        <div className="w-full  flex justify-start flex-col gap-2 mb-8">
          <div className="flex gap-1">
            <img
              src={chatMessage?.sender?.profileImage || "/assests/"}
              alt="msg-user"
              className="w-[15px] h-[15px] rounded-full"
            />
            <p className="mb-0 text-[11px] ">
              {" "}
              {chatMessage?.sender?.username}{" "}
              {format(new Date(chatMessage?.createdAt), "p")}
            </p>
          </div>
          {chatMessage?.text ? (
            <p className="bg-gray-300  p-2 text-black rounded-md max-w-[200px] h-auto break-words">
              {chatMessage?.text}
            </p>
          ) : (
            <img
              src={chatMessage?.photo || "/assests/"}
              alt="msg-user"
              className="w-[130px] h-[130px]"
            />
          )}
        </div>
      ) : (
        <div className="w-full flex justify-end">
          <div>
            <p className="mb-0 text-[11px] ">
              {" "}
              {format(new Date(chatMessage?.createdAt), "p")}
            </p>
            {chatMessage?.text ? (
              <p className="bg-blue-500 max-w-[200px] h-auto break-words p-2 text-white rounded-md ">
                {chatMessage?.text}
              </p>
            ) : (
              <img
                src={chatMessage?.photo || "/assests/"}
                className="w-[130px] h-[130px]"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default MessageBox;
