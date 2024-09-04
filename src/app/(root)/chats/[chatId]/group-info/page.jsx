"use client";
import { CldUploadButton } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { MdGroups } from "react-icons/md";

const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});

  const { chatId } = useParams();
  const getChatDetails = async () => {
    try {
      const { data } = await axios.get(`/api/chats/${chatId}`);
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const router = useRouter();

  const updateGroupChat = async (data) => {
    console.log("Updatingggg data", data);
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/chats/${chatId}/updateGroup`,
        data,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Log the raw response
      const contentType = res.headers.get("Content-Type");
      const responseText = await res.text(); // Read response as plain text for debugging

      console.log("Raw response text:", responseText);

      if (!res.ok) {
        throw new Error(
          `HTTP error! Status: ${res.status}, Message: ${responseText}`
        );
      }

      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
        const responseData = JSON.parse(responseText); // Parse JSON response
        console.log("Response data:", responseData);
      } else {
        console.error("Unexpected response format:", responseText);
        throw new Error(`Unexpected response format: ${responseText}`);
      }

      setLoading(false);

      if (res.ok) {
        router.push(`/chats/${chatId}`);
      }
    } catch (error) {
      console.log("There is error in api fetching", error);
    }
  };

  return loading ? (
    <>Loading...</>
  ) : (
    <div className="w-full flex justify-center mt-[2%]">
      <div className="w-[80%] md:w-[60%] lg:w-[30%] flex flex-col gap-[40px] ">
        <span className="flex justify-center">
          <p className="text-xl font-semibold">Edit Group Info</p>
        </span>
        <form
          className="w-full flex flex-col gap-[40px]"
          onSubmit={handleSubmit(updateGroupChat)}
        >
          <span className="relative flex justify-center">
            <input
              type="text"
              className="outline-none p-2 shadow-md w-[80%] border-gray-100 border rounded-md"
              {...register("name", {
                required: "Group chat name is required",
              })}
              placeholder="Group chat name"
            />
            <MdGroups
              className="absolute top-[25%] right-[15%] text-gray-500"
              size={25}
            />
          </span>
          <span className="text-red-500">
            {errors.username && <p>{errors.username.message}</p>}
          </span>{" "}
          <div className="flex items-center  justify-around">
            <span>
              <img
                src={watch("groupPhoto") || " /assests/group.jpg"}
                alt="profile"
                className="h-[120px] w-[120px] rounded-full"
              />
            </span>
            <span>
              <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={uploadPhoto}
                uploadPreset="vtenqo0l"
              >
                <p className="text-base font-medium">Upload new photo</p>
              </CldUploadButton>{" "}
            </span>
          </div>{" "}
          <div className="flex flex-wrap gap-3">
            {chat?.members?.map((member, index) => (
              <span
                key={member._id}
                className="px-3 py-1 bg-blue-300 rounded-md shadow-md text-white flex items-center gap-2"
              >
                {member.username}
              </span>
            ))}
          </div>
          <span className=" flex justify-center">
            <button
              className="w-[70%] p-2 bg-red-500 rounded-md text-white"
              type="submit"
            >
              Save changes
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default GroupInfo;
