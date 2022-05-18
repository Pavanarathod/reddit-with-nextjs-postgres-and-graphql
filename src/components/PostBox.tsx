import {
  BanIcon,
  LinkIcon,
  PhotographIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { useForm } from "react-hook-form";

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

const PostBox: React.FC = () => {
  const { data: session } = useSession();
  const [selectImage, setSelectImage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="sticky top-16 bg-white border z-50 border-gray-300 rounded-md p-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar userName={session?.user?.name} />

        <input
          {...register("postTitle", { required: true })}
          className="bg-gray-50 p-2 pl-5 outline-none rounded-md flex-1"
          type="text"
          placeholder={
            session
              ? `create a post by entering title`
              : "you need to sign to create post."
          }
        />
        {!!watch("postTitle") && (
          <XCircleIcon
            onClick={() => reset()}
            className="h-6 text-red-400 cursor-pointer"
          />
        )}
        <PhotographIcon
          onClick={() => setSelectImage(!selectImage)}
          className={`h-6 cursor-pointer ${
            selectImage ? "text-blue-300" : "text-gray-500"
          }`}
        />
        <LinkIcon className={`h-6 text-gray-500`} />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register("postBody")}
              type="text"
              placeholder="Text (Optional)"
            />
          </div>

          {/* SUB REDDIT */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Subreddit:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register("subreddit", { required: true })}
              type="text"
              placeholder="i.e. reactjs"
            />
          </div>
          {selectImage && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("postImage")}
                type="text"
                placeholder="Enter you'r image url"
              />
            </div>
          )}

          {/* errors */}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>A Post Title is required</p>
              )}

              {errors.subreddit?.type === "required" && (
                <p>A subreddit is required</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button
              type="submit"
              className="w-full bg-blue-400 p-2 text-white rounded-full"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default PostBox;
