import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "lucide-react";
import DepositBackground from "@/assets/images/im_deposit_bg.svg";

interface DepositCardProps {
  date?: Date;
  location: string;
  collectedCount: number;
  totalTarget: number;
}

const DepositCard: React.FC<DepositCardProps> = ({
  date = new Date(),
  location,
  collectedCount,
  totalTarget,
}) => {
  const formattedDate = format(date, "d MMM yyyy", { locale: id });

  return (
    <div className="relative w-full overflow-hidden text-white bg-[#282828] rounded-2xl">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-15">
        {/* <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,25 C150,75 250,0 400,25 L400,200 L0,200 Z"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M0,50 C150,100 250,25 400,50 L400,200 L0,200 Z"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M0,75 C150,125 250,50 400,75 L400,200 L0,200 Z"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg> */}

        <img src={DepositBackground} alt="Profile" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-white/70" />
            <span className="text-sm text-white/70">{formattedDate}</span>
          </div>
          <div className="px-3 py-1 text-sm bg-white rounded-full bg-opacity-10">
            {location}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-3">
          <div className="flex items-baseline">
            <span className="text-4xl">{collectedCount}</span>
            <span className="ml-2 text-4xl ">/ {totalTarget}</span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            Dana lapak telah terkumpul
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositCard;
