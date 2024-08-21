"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
const Navbar = () => {
  const pathname = usePathname();

  const handleLogOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-[85%] flex justify-between items-center">
          <div>
            <img
              src="/assests/logo.png"
              alt="logo"
              className="w-[120px] h-[80px]"
            />
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/chats"
              className={`font-semibold ${
                pathname === "/chats" ? "text-red-500" : ""
              }`}
            >
              Chats
            </Link>
            <Link
              href="/contacts"
              className={` font-semibold${
                pathname === "/contacts" ? "text-red-500" : ""
              }`}
            >
              Contacts
            </Link>
            <span onClick={handleLogOut} className="cursor-pointer">
              <AiOutlineLogout size={25} className="text-gray-400" />
            </span>

            <Link href="/profile">
              <img
                src={user?.profileImage || "/assests/user.png"}
                alt="logo"
                className="w-[45px] rounded-full"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
