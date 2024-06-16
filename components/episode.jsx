import React, { useContext, useEffect, useState } from "react";
import { PlayIcon } from "@radix-ui/react-icons";
import { Context } from "@/State/stateIndex";
import { Button } from "@/components/appUI/button";
import Image from "next/image";
import toast from "react-hot-toast";
import supabase from "@/config/supabaseClient";

function Episode({ episode, season, showId }) {
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
      payload: { ...season, showId },
    });
  };

  const addEpisodeToFavorite = async () => {
    if (!user) {
      toast.error("Please Login to add to favorite");
      return;
    }

    const body = {
      user_id: user.id, // Use the user's UUID instead of email
      show_id: showId, // Use the show's ID
      season_no: season.season_no, // Use the season's number
      episode_no: episode.episode_no, // Use the episode's number
    };

    const { data, error } = await supabase.from("favorite_list").insert([body]);
    if (error) {
      console.error("Error adding episode to favorite:", error.message);
      return;
    }

    dispatch({
      type: "Favorite",
      payload: [...favorite, ...data],
    });
  };

  const removeEpisodeToFavorite = async () => {
    if (!user) {
      toast.error("Please Login to remove from favorite");
      return;
    }

    const { error } = await supabase
      .from("favorite_list")
      .delete()
      .eq("user_id", user.id)
      .eq("show_id", showId)
      .eq("season_no", season.season_no)
      .eq("episode_no", episode.episode_no);

    if (error) {
      console.error("Error removing episode from favorite:", error.message);
      return;
    }

    const updatedFavorite = favorite.filter(
      (item) =>
        !(
          item.episode_no === episode.episode_no &&
          item.season_no === season.season_no &&
          item.show_id === showId
        )
    );

    dispatch({
      type: "Favorite",
      payload: updatedFavorite,
    });
  };

  useEffect(() => {
    const checkFavorite = () => {
      const is = favorite?.filter((item) => {
        if (
          item.episode_no === episode.episode_no &&
          item.season_no === season.season_no &&
          item.show_id === showId
        ) {
          return true;
        }
      });
      return is.length !== 0;
    };

    setIsFavorite(checkFavorite());
  }, [favorite, episode, season, showId]);

  return (
    <li className="p-2 my-2.5 bg-gray-700 flex flex-col sm:flex-row gap-4 sm:items-center rounded-md justify-between">
      <div className="flex">
        <div className="text-3xl text-cyan-600 font-semibold h-full mr-2">
          {episode?.episode_no < 10 ? "0" + episode?.episode_no : episode?.episode_no}
        </div>
        <div className="flex-1">
          <h6>{episode?.title}</h6>
          <p className="text-sm line-clamp-1 text-gray-200">
            {episode?.description}
          </p>
        </div>
      </div>
      <div className="flex justify-center min-w-[100px]">
        {isFavorite ? (
          <Button variant="icon" onClick={removeEpisodeToFavorite}>
            <Image
              src={"https://cdn-icons-png.flaticon.com/128/2589/2589175.png"}
              alt="icon"
              height={30}
              width={30}
              className="mr-2"
            />
          </Button>
        ) : (
          <Button variant="icon" onClick={addEpisodeToFavorite}>
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
          className="rounded-full bg-black p-2 cursor-pointer"
        >
          <PlayIcon className="h-[1.2rem] w-[1.2rem] text-white" />
        </span>
      </div>
    </li>
  );
}

export default Episode;
