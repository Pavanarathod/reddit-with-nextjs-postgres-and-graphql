import Image from "next/image";
import React from "react";

interface AvatarProps {
  userName?: string | undefined | null;
  large?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ userName, large }) => {
  return (
    <div
      className={`relative overflow-hidden h-10 w-10 rounded-full border border-gray-300 bg-white ${
        large && "h-20 w-20"
      }`}
    >
      <Image
        layout="fill"
        src={`https://avatars.dicebear.com/api/open-peeps/${
          userName || "placeholder"
        }.svg`}
      />
    </div>
  );
};

export default Avatar;
