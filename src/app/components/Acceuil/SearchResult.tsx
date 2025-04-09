import Image from "next/image";

import concert from "../../../../public/images/acceuil/concert.webp";
import { IoLocationSharp } from "react-icons/io5";
import { IoMdCalendar } from "react-icons/io";

export default function SearchResult({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick,
}: {
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex flex-col xs:flex-row gap-2 xs:gap-5 items-center w-full hover:bg-lightGray/10 rounded-md p-2 text-center xs:text-left">
      <Image
        src={concert}
        alt="concert"
        className="size-10 sm:size-14 rounded-full flex-shrink-0"
      ></Image>
      <div className="flex flex-col xs:items-start text-xs sm:text-base w-full">
        <h1>Afterlife Tulum 2025 I Day 1</h1>
        <div className=" flex-col xs:gap-3  flex xs:flex-row xs:items-start w-full">
          <div className="flex items-center justify-center xs:justify-start gap-1">
            <IoLocationSharp /> Zamna, Tulum, MX
          </div>
          <div className="flex items-center justify-center xs:justify-start gap-1">
            <IoMdCalendar />
            Sam.4 janv 2025
          </div>
        </div>
      </div>
    </div>
  );
}
