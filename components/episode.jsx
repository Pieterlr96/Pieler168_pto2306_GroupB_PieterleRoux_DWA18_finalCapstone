"use client";
import React, { useContext, useEffect, useState } from "react";
import { PlayIcon, Heart } from "@radix-ui/react-icons";
import { Context } from "@/State";
import { Button } from "./appUI/button";
import Image from "next/image";
import toast from "react-hot-toast";
import supabase from "@/config/supabaseClient";

function Episode({ episode, season, showId, showName, showImage,updated }) {
  const { dispatch } = useContext(Context);
  const {
    state: { favorite, user },
  } = useContext(Context);

  const [isFavorite, setIsFavorite] = useState(false);
 
  const handleEpisodeClick = () => {
    dispatch({
      type: "Play",
      payload: episode,
    });
    dispatch({
      type: "Season",
      payload: { ...season, showId, showName, showImage },
    });
  };

  const addEpisodeToFavorite = async (id) => {
    if (!user) {
      toast.error("Please Login to add to favorite");
      return;
    }
    function generateRandomId() {
      // Generate a random number between 100000 and 999999 (inclusive)
      const min = 100000;
      const max = 999999;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

      // Convert the random number to a string and return it
      return randomNum.toString();
    }

    const body = {
      id: generateRandomId(),
      showId: showId,
      showName: showName,
      seasonNo: season.season,
      seasonName: season.title,
      showImage: season.image,
      episodeNo: episode.episode,
      updated: updated,
      userId: user.email,
    };
    console.log("season",updated);
    const { data, error } = await supabase
      .from("favoriteList")
      .insert(body)
      .select()
      .eq("userId", user.email);
    dispatch({
      type: "Favorite",
      payload: [...favorite, ...data],
    });
  };
  const removeEpisodeToFavorite = async (id) => {
    // console.log("Remove");
    const { error } = await supabase
      .from("favoriteList")
      .delete()
      .eq("userId", user.email)
      .eq("showId", showId)
      .eq("seasonNo", season.season)
      .eq("episodeNo", episode.episode);

    const { data } = await supabase
      .from("favoriteList")
      .select()
      .eq("userId", user.email);
    dispatch({
      type: "Favorite",
      payload: data,
    });
  };
  const checkFavorite = (id) => {
    const is = favorite?.filter((item) => {
      if (
        item.episodeNo == id &&
        item.seasonNo == season.season &&
        item.showId == showId
      ) {
        return true;
      }
    });

    return is.length !== 0;
  };

  useEffect(() => {
    const isValid = checkFavorite(episode.episode);
    setIsFavorite(isValid);
  }, [favorite]);

  return (
    <li className="p-2 my-2.5 bg-gray-700 flex flex-col sm:flex-row gap-4 sm:items-center rounded-md justify-between">
      <div className="flex ">
        <div className="text-3xl text-cyan-600 font-semibold h-full mr-2">
          {episode?.episode < 10 ? "0" + episode?.episode : episode?.episode}
        </div>
        <div className="flex-1 ">
          <h6>{episode?.title}</h6>
          <p className="text-sm line-clamp-1 text-gray-200">
            {episode?.description}
          </p>
        </div>
      </div>
      <div className="flex justify-center min-w-[100px]">
        {isFavorite ? (
          <Button variant="icon" onClick={() => removeEpisodeToFavorite()}>
            <Image
              src={"https://cdn-icons-png.flaticon.com/128/2589/2589175.png"}
              alt="icon"
              height={30}
              width={30}
              className="mr-2"
            />
          </Button>
        ) : (
          <Button
            className=""
            variant="icon"
            onClick={() => addEpisodeToFavorite()}
          >
            <Image
              src={"https://cdn-icons-png.flaticon.com/128/151/151910.png"}
              alt="icon"
              height={30}
              width={30}
              className="mr-2"
            />
          </Button>
        )}
        <span
          onClick={handleEpisodeClick}
          className=" rounded-full bg-black p-2 cursor-pointer"
        >
          <PlayIcon className="h-[1.2rem] w-[1.2rem] text-white" />
        </span>
      </div>
    </li>
  );
}

export default Episode;
