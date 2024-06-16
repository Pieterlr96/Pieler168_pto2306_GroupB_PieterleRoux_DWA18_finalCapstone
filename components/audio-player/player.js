"use client";
import React, { useState, useContext, useRef, useEffect } from "react";

import ProgressBar from "./progress-bar";
import Controls from "./controls";
import Volume from "./volume";
import { Context } from "@/State/stateIndex";
import Image from "next/image";

function Player() {
  const {
    state: { episode, season },
  } = useContext(Context);
  const [duration, setDuration] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);
  const progressBarRef = useRef();
  const audioRef = useRef();
  useEffect(() => {
    if (!episode) return;
    // console.log("episode:------>son ", {episode, season});
    const history = JSON.parse(localStorage.getItem("history"));
    if (!history) {
      localStorage.setItem(
        "history",
        JSON.stringify([
          {
            showName: season?.title,
            showId: season.showId,
            showName: season.showName,
            showImage: season.showImage,
            timeProgress,
            ...episode,
          },
        ])
      );
    } else {
      const existingIndex = history.findIndex(
        (item) =>
          item.episode === episode.episode &&
          item.showId === season.showId &&
          item.showName === season.showName
      );

      if (existingIndex !== -1) {
        // Remove the existing episode from the history array
        history.splice(existingIndex, 1);
      }
      if(history.length > 0){
        history[0].timeProgress =  Math.round(audioRef?.current?.currentTime);
      }
      localStorage.setItem(
        "history",
        JSON.stringify([
          {
            showName: season?.title,
            showId: season.showId,
            showName: season.showName,
            showImage: season.showImage,
            timeProgress:0,
            duration: audioRef.current.duration,
            ...episode,
          },
          ...history,
        ])
      );
    }
    setTimeProgress(0);
    audioRef.current.currentTime = 0;
  }, [episode, season]);

  useEffect(()=>{
    // console.log("season: ", season);
    setTimeProgress(season?.timeProgress || 0);
    audioRef.current.currentTime = season?.timeProgress || 0;
  },[season]);

  useEffect(() => {
    if(!timeProgress) return;
    const history = JSON.parse(localStorage.getItem("history"));
    history[0].timeProgress = timeProgress;
    localStorage.setItem("history", JSON.stringify(history));
  },[timeProgress]);

  return (
    <>
      <div className="fixed px-4 bottom-0 left-0 right-0 bg-gray-900 min-h-20 grid sm:grid-cols-3 w-full grid-cols-1">
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className="relative">
            <Image
              src={season?.image || "https://cdn-icons-png.flaticon.com/128/1179/1179069.png"}
              alt={season?.title || "podcast" }
              width={40}
              height={40}
            />
          </div>
          <div>
            <h6 className="text-sm font-medium">{episode?.title}</h6>
            <p className="text-sm flex items-center">
              Season {season?.season}{" "}
              <span className="h-1 w-1 rounded-full bg-gray-500 mx-1" />
              Episode {episode?.episode}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <Controls
            audioRef={audioRef}
            audioFile={episode?.file}
            duration={duration}
            setDuration={setDuration}
            timeProgress={timeProgress}
            setTimeProgress={setTimeProgress}
            progressBarRef={progressBarRef}
            volume={volume}
            muteVolume={muteVolume}
          />
          <ProgressBar
            audioRef={audioRef}
            progressBarRef={progressBarRef}
            duration={duration}
            timeProgress={timeProgress}
            setTimeProgress={setTimeProgress}
          />
        </div>
        <div className="flex justify-center max-[640px]:my-4">
          <Volume
            volume={volume}
            setVolume={setVolume}
            muteVolume={muteVolume}
            setMuteVolume={setMuteVolume}
          />
        </div>
      </div>
    </>
  );
}

export default Player;
