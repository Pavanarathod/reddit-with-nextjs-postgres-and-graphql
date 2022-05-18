/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ChevronDownIcon, HomeIcon } from "@heroicons/react/solid";
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session } = useSession();
  console.log("session", session);
  return (
    <div className="bg-white border-b border-gray-200 w-full sticky top-0">
      <div className="flex items-center bg-white px-4 py-2 shadow-sm">
        <div>
          <img
            src="/images/RedditLogo.png"
            className="h-10 w-20 object-contain flex-shrink-0"
          />
        </div>
        {/* HOME */}
        <div className="flex items-center cursor-pointer mx-7 xl:min-w-[300px]">
          <HomeIcon className="h-5" />
          <p className="flex-1 ml-2 font-semibold hidden lg:inline">Home</p>
          <ChevronDownIcon className="h-5" />
        </div>

        {/* SEARCH */}
        <div className="bg-gray-100 flex-1 p-1 px-3 rounded-md">
          <div className="flex items-center space-x-2">
            <SearchIcon className="h-6 text-gray-500" />
            <input
              type="text"
              placeholder="Search Reddit"
              className=" bg-transparent border border-gray-200 w-full outline-none px-2 font-semibold text-sm"
            />
          </div>
        </div>
        {/* BURGER */}
        <div className="lg:hidden px-5">
          <MenuIcon className="h-9" />
        </div>
        {/* iCONS */}
        <div className=" hidden lg:inline-flex items-center px-3 space-x-1">
          <SparklesIcon className="icon" />
          <GlobeIcon className="icon" />
          <VideoCameraIcon className="icon" />
          <hr className="h-10 border border-gray-100" />
          <ChatIcon className="icon" />
          <BellIcon className="icon" />
          <PlusIcon className="icon" />
          <SpeakerphoneIcon className="icon" />
        </div>
        {/* AUTH */}
        {session ? (
          <div
            onClick={() => signOut()}
            className="flex items-center lg:space-x-3 rounded-lg hover:bg-gray-100 hover:cursor-pointer"
          >
            <img
              src="https://links.papareact.com/23l"
              alt="reddit icon"
              className="h-6 w-5"
            />
            <div className="flex-1">
              <p className="truncate text-sm">{session?.user?.name}</p>
              <p className="hidden lg:inline-flex text-xs">Sign out</p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => signIn()}
            className="flex items-center lg:space-x-3 rounded-lg lg:p-2 hover:bg-gray-100 hover:cursor-pointer"
          >
            <img
              src="https://links.papareact.com/23l"
              alt="reddit icon"
              className="h-6 w-5 "
            />
            <p className="hidden lg:inline-flex">Sign in</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
