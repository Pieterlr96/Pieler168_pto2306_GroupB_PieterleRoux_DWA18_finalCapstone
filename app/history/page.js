"use client";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "@/components/appUI/button";
import Image from "next/image";
import Link from "next/link";
import { PlayIcon} from "@radix-ui/react-icons";
import { Context } from "@/State";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const {
    state: {user },
  } = useContext(Context);
  const { dispatch } = useContext(Context);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history"));
    console.log("-------->history", data);
    if (!data) return;
    setHistory(data);
  }, []);
  const resetHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
  };
  const handleEpisodeClick = (item) => {
    // alert("Episode clicked");
    // console.log("item: ------->> ", item);
    dispatch({ type: "Play", payload: item });
    dispatch({
      type: "Season",
      payload: {
        ...item,
        title: item.showName,
        image: item.showImage,
        timeProgress: item?.timeProgress || 0,
        duration: 42,
      },
    });
  };
  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="pt-24 min-h-[100vh] bg-gray-950">
      <h1 className="text-4xl text-center font-semibold underline mb-4">
        Listening History
      </h1>
      <div className="pl-4 flex gap-4 pt-4 pb-4">
        <Link href="/">
          <Button className="flex items-center ml-4">
            <Image
              src={"https://cdn-icons-png.flaticon.com/128/2099/2099238.png"}
              alt="icon"
              height={20}
              width={20}
              className="mr-2"
            />
            Back
          </Button>
        </Link>
        <Button onClick={resetHistory}>Reset History</Button>
      </div>
      {history.length === 0 && (
        <div className="text-3xl text-center font-semibold text-gray-200 mt-10">
          No history found
        </div>
      )}
      <div className="w-[80%] m-auto sm:pb-[80px] pb-[110px]">
        {history.map((item, index) => (
          <div
            key={index}
            className="p-2 my-2.5 bg-gray-700 flex flex-col sm:flex-row gap-4 sm:items-center rounded-md justify-between"
          >
            <div className="flex justify-center items-center">
              <div>
                <Image
                  src={item.showImage}
                  alt={"image"}
                  width={80}
                  height={60}
                  className="rounded-md mr-2"
                />
              </div>
              <div className="text-3xl text-cyan-600 font-semibold h-full mr-2">
                {item.episode < 10 ? "0" + item.episode : item.episode}
              </div>
              <div className="flex-1">
                <h6>{item.title}</h6>
                <p className="text-sm line-clamp-1 text-gray-200">
                  {item.description}
                </p>
                <div className="hidden sm:flex items-center gap-2 max-w-[300px] ml-10 mt-1">
                  <span className="text-xs">
                    {formatTime(item.timeProgress)}
                  </span>
                  <input
                    disabled
                    type="range"
                    defaultValue={item.timeProgress}
                    className="w-full"
                  ></input>
                  <span className="text-xs">{formatTime(item?.duration)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-2">
              <div className="sm:hidden flex items-center gap-2 max-w-[300px] ">
                <span className="text-xs">{formatTime(item.timeProgress)}</span>
                <input
                  disabled
                  type="range"
                  defaultValue={item.timeProgress}
                  className="w-full"
                ></input>
                <span className="text-xs">{formatTime(item?.duration)}</span>
              </div>
              <span
                onClick={() => handleEpisodeClick(item)}
                className=" rounded-full bg-black p-2 cursor-pointer"
              >
                <PlayIcon className="h-[1.2rem] w-[1.2rem] text-white" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
