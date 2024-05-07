"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="space-y-2 ,b-4">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Bem vindo de volta{isLoaded ? ", " : " "}
        {user?.firstName} 👋
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        Seu Dashboard financeiro em um só lugar!
      </p>
    </div>
  );
};

export default WelcomeMsg;
