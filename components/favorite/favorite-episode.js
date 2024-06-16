"use client";
import React, { useContext, useEffect, useState } from "react";
import { PlayIcon, Heart } from "@radix-ui/react-icons";
import { Context } from "@/State/stateIndex";
import { Button } from "@/components/appUI/button";
import supabase from "@/config/supabaseClient";
import Image from "next/image";

function FavoriteEpisode({
  episode,
  season,
  showId,
  showName,
  setReload,
  reload,
}) {
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
      payload: season,
    });
  };

  const removeEpisodeToFavorite = async (id) => {
    const { error } = await supabase
      .from("favoriteList")
      .delete()
      .eq("showId", showId)
      .eq("seasonNo", season.season)
      .eq("episodeNo", episode.episode)
      .eq("userId", user.email);

    const { data } = await supabase
      .from("favoriteList")
      .select()
      .eq("userId", user.email);
    dispatch({
      type: "Favorite",
      payload: data,
    });
    setReload(!reload);
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

  if (!isFavorite) return null;

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
        <Button variant="icon" onClick={() => removeEpisodeToFavorite()}>
          <Image
            src={"https://cdn-icons-png.flaticon.com/128/2589/2589175.png"}
            alt="icon"
            height={30}
            width={30}
            className="mr-2"
          />
        </Button>
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

export default FavoriteEpisode;
