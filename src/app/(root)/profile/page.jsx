"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { LuUser2 } from "react-icons/lu";
import { CldUploadButton } from "next-cloudinary";
import { useForm } from "react-hook-form";
// import { LuLoader } from "react-icons/lu";
import Loader from "../../components/Loader";
import axios from "axios";

const Profile = () => {
  const { data: session } = useSession();

  const user = session?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const uploadImage = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    try {
      const response = await axios.put(`/api/users/${user._id}/update`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("User updated successfully:", response.data);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full flex justify-center mt-[2%]">
      <div className="w-[80%] md:w-[60%] lg:w-[30%] flex flex-col gap-[40px] ">
        <span className="flex justify-center">
          <p className="text-xl font-semibold">Edit Your Profile</p>
        </span>
        <form
          className="w-full flex flex-col gap-[40px]"
          onSubmit={handleSubmit(updateUser)}
        >
          <span className="relative flex justify-center">
            <input
              type="text"
              placeholder={user?.username || "username"}
              className="outline-none p-2 shadow-md w-[80%] border-gray-100 border rounded-md"
              {...register("username", {
                required: "Username is required",
                validate: (value) => {
                  if (value.length < 3) {
                    return "Username must be at least 3 characters";
                  }
                },
              })}
            />
            <LuUser2 className="absolute top-[25%] right-[15%] text-gray-500" />
          </span>
          <span className="text-red-500">
            {errors.username && <p>{errors.username.message}</p>}
          </span>{" "}
          <div className="flex items-center  justify-around">
            <span>
              <img
                src={
                  watch("profileImage") ||
                  user?.profileImage ||
                  "assests/person.jpg"
                }
                alt="profile"
                className="h-[120px] w-[120px] rounded-full"
              />
            </span>
            <span>
              <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={uploadImage}
                uploadPreset="vtenqo0l"
              >
                <p className="text-base font-medium">Upload new photo</p>
              </CldUploadButton>{" "}
            </span>
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

export default Profile;
