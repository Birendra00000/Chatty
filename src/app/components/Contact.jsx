"use client";
import { selectClasses } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";

const Contact = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [allContacts, setAllContacts] = useState([]);
  const [search, setSearch] = useState("");

  console.log("search contact", search);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
      );
      setAllContacts(
        response.data.filter((contact) => contact._id !== currentUser._id)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, search]);

  //SELECT CONTACT
  const [selectedContacts, setSelectedContacts] = useState([]);

  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };
  //for selecting contact name
  const [name, setName] = useState("");

  //For removing any items

  const handleRemove = (id) => {
    setSelectedContacts((preContact) =>
      preContact.filter((contact) => contact.id !== id)
    );
  };
  console.log("Contact array", selectedContacts);

  //CREATE CHATS

  const createChat = async () => {
    const response = await axios.post("/api/chats", {
      currentUserId: currentUser._id,
      members: selectedContacts.map((contact) => contact._id),
      isGroup,
      name,
    });
    const chat = response.data; // Axios automatically parses JSON
    if (response.status === 200) {
      router.push(`/chats/${chat._id}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="w-full flex">
        <input
          type="text"
          placeholder="Search contact ......"
          className="p-2 w-1/2 rounded-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </span>
      <div className="grid  grid-cols-2 gap-x-8">
        <div className="shadow-md bg-white  rounded-md overflow-y-auto w-full flex justify-center ">
          <div className=" w-11/12 mt-3">
            <span>
              <p className="mb-0 font-semibold">Select or Desclect</p>
            </span>
            <div className="flex flex-col gap-y-2">
              {allContacts &&
                allContacts.map((users) => {
                  return (
                    <div
                      key={users.id}
                      className="flex gap-3 items-center mt-4"
                      onClick={() => handleSelect(users)}
                    >
                      {selectedContacts.find((items) => items === users) ? (
                        <FaRegCheckCircle className="text-blue-600" />
                      ) : (
                        <MdRadioButtonUnchecked />
                      )}
                      <img
                        src={users?.profileImage || "assests/person.png"}
                        alt="chat--user"
                        className="w-[40px] h-[40px] rounded-full"
                      />
                      <p>{users?.username}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>
              {isGroup && (
                <div className="flex flex-col gap-2 mb-6">
                  <span>
                    <p className="mb-0 font-semibold">Group Chat Name</p>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter group chat Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="p-2 rounded-md w-10/12"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-6">
              <span className="mb-0 font-semibold"> Members</span>
              <div className="flex flex-nowrap gap-3">
                {selectedContacts.map((item) => {
                  return (
                    <span
                      key={item.id}
                      className="px-3 py-1 bg-blue-300 rounded-md shadow-md text-white flex items-center gap-2"
                    >
                      {item.username}
                      <RxCross2
                        className="text-white bg-red-500 rounded-full cursor-pointer"
                        onClick={() => handleRemove(item.id)}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <span className="flex w-full justify-center">
            <button
              className="mb-0 font-semibold bg-red-400 w-2/3 p-2 rounded-md shadow-md text-white"
              onClick={createChat}
            >
              {" "}
              Start New Chatt
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
