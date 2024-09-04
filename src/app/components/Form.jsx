"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

const Form = ({ type }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (type === "register") {
      try {
        const response = await axios.post("/api/auth/register", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          return router.push("/");
        }
        console.log("response", response.data);

        if (response.error) {
          return console.log("Something went wrong");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
    if (type === "login") {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      console.log("datatatta", "credentials");
      if (response.ok) {
        return router.push("/chats");
      }
      console.log("LogInresponse", response);

      if (response.error) {
        console.log("error", response.error);
      }
    }
  };

  return (
    <div className="h-[600px] w-full flex justify-center items-center">
      <form
        className="h-[370px]  shadow-md bg-white w-[90%] lg:w-[370px] rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <span className="h-[20%] flex gap-2 items-center justify-center">
          <img
            src="/assests/logo.png"
            alt="logo"
            className="w-auto h-[55px] "
          />
          <span className=" text-[25px] text-blue-400 font-semibold ">
            <p className="mb-0 ">
              {type === "register" ? "Register" : "Log In"}
            </p>
          </span>
        </span>

        <div className="flex flex-col justify-center items-center h-[70%] gap-[5%]">
          {type === "register" && (
            <>
              <input
                type="text"
                placeholder="Username"
                className="border rounded-lg p-2 w-[80%] text-[14px] lg:text-[16px] mt-3 outline-none"
                name="username"
                {...register("username", {
                  required: "Username is required",
                  validate: (value) => {
                    if (value.length < 5)
                      return "Username must be at least 5 character ";
                  },
                })}
              />
              {errors.username && (
                <span className="text-red-500 text-[8px]">
                  {errors.username.message}
                </span>
              )}
            </>
          )}
          <>
            <input
              type="email"
              placeholder="E-mail"
              className="border outline-none rounded-lg p-2 mt-1 w-[80%] text-[14px] lg:text-[16px]"
              name="email"
              {...register("email", {
                required: "Email is required",
              })}
            />{" "}
            {errors.email && (
              <span className="text-red-500 text-[8px]">
                {errors.email.message}
              </span>
            )}
          </>
          <>
            {" "}
            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg p-2 mt-1 w-[80%] text-[14px] lg:text-[16px] outline-none"
              name="password"
              {...register("password", {
                required: "Password is required",
                validate: (value) => {
                  if (
                    value.length < 5 ||
                    !value.match(/[!@#$%^&*(),.?":{}|<>]/)
                  )
                    return "Password must be at least 5 character and contain at least one special character";
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-[8px]">
                {errors.password.message}
              </span>
            )}
          </>
          {/* {error && (
            <>
              <div className="flec justify-start text-red-700 text-[14px] lg:text-[16px]">
                {error}
              </div>
            </>
          )} */}
          <div className=" items-center justify-center  flex text-lg w-[100%]">
            <button
              className="bg-sky-500 text-white w-[30%] p-1 rounded-lg text-[14px] lg:text-[16px]"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </div>
        <Link href={type === "register" ? "/" : "/register"}>
          <div className="flex justify-center text-[14px] lg:text-[16px]">
            <p>
              {type === "register" ? (
                <>
                  Already have an account?{" "}
                  <span className="text-blue-400 underline">Sign In here </span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span className="text-blue-400 underline">
                    Pleased Register{" "}
                  </span>
                </>
              )}
            </p>
          </div>
        </Link>
      </form>
    </div>
  );
};

export default Form;
