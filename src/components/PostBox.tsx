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
import { useMutation } from "@apollo/client";
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutation";
import client from "../../apollo-client";
import { GET_SUBREDDIT_BY_TOPIC } from "../graphql/queries";
import toast from "react-hot-toast";

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

const PostBox: React.FC = () => {
  const { data: session } = useSession();
  const [addPost] = useMutation(ADD_POST);
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [selectImage, setSelectImage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    const notification = toast.loading("Creating new post");
    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: formData.subreddit,
        },
      });

      const subredditExists = getSubredditListByTopic.length > 0;

      if (!subredditExists) {
        console.log("Subreddit is new => createing NEW subreddit");
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });
        console.log("Creating post", formData);
        const image = formData.postImage || "";
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit?.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
        console.log("New post", newPost);
      } else {
        const image = formData.postImage || "";
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0]?.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });

        console.log("New post added", newPost);
      }
      // AFTER POST BEEN ADDED
      reset();
      toast.success("New post created", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoosp something went wrong...", {
        id: notification,
      });
    }
  };

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
                <p className="font-semibold">A Post Title is required</p>
              )}
              {errors.subreddit?.type === "required" && (
                <p className="font-semibold">A subreddit is required</p>
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
