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
    // Dispatch actions based on backend data structure and selected episode
  };

  const removeEpisodeToFavorite = async () => {
    // Update to use Supabase queries to remove episode from favorites
  };

  const checkFavorite = () => {
    // Implement logic to check if episode is in the list of favorite episodes
  };

  useEffect(() => {
    // Fetch favorite episodes from backend API
    // Update state with fetched favorite episodes
  }, [reload]); // Trigger fetch when reload state changes

  useEffect(() => {
    // Check if episode is in the list of favorite episodes
    setIsFavorite(checkFavorite());
  }, [favorite]); // Update when favorite list changes

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
        <Button variant="icon" onClick={removeEpisodeToFavorite}>
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
