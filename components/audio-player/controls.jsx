import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  PlayIcon,
  PauseIcon,
  TrackPreviousIcon,
  TrackNextIcon,
  ShuffleIcon,
  LoopIcon,
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";

function Controls({
  audioRef,
  audioFile,
  duration,
  setDuration,
  timeProgress,
  setTimeProgress,
  progressBarRef,
  volume,
  muteVolume,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopActive, setLoopActive] = useState(false);

  const playAnimationRef = useRef();

  const repeat = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);

    progressBarRef.current.value = currentTime;
    progressBarRef.current.style.setProperty(
      "--range-progress",
      `${(progressBarRef.current.value / duration) * 100}%`
    );

    if (!audioRef.current.ended && !audioRef.current.paused)
      playAnimationRef.current = requestAnimationFrame(repeat);
    else setIsPlaying(false);
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  const skipForward = () => {
    audioRef.current.currentTime += 15;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 15;
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    console.log("audioRef: ", audioRef.current);
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [isPlaying, audioRef, repeat]);

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  const enableLoop = () => {
    audioRef.current.loop = !setLoopActive;
    setLoopActive((prev) => !prev);
  };

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave?";
      return "Are you sure you want to leave?";
    };
    if (isPlaying) {
      window.addEventListener("beforeunload", unloadCallback);
      setInterval(() => {
        return () => window.removeEventListener("beforeunload", unloadCallback);
      }, 100);
    }
    console.log("event: ", { audio: audioRef.current.currentTime });
  }, [isPlaying]);
  // useEffect(()=>{
  //   audioRef.current.play();
  //   playAnimationRef.current = requestAnimationFrame(repeat);
  // },[])

  return (
    <>
      <audio
        ref={audioRef}
        src={audioFile}
        onLoadedMetadata={onLoadedMetadata}
      />
      <div className="flex justify-center gap-2 items-center">
        {/* <button className="p-2 inline-block  rounded-full cursor-pointer">
          <ShuffleIcon className="h-[1rem] w-[1rem]" />
        </button>
        <button className="p-2 inline-block  rounded-full cursor-pointer">
          <DoubleArrowLeftIcon
            className="h-[1rem] w-[1rem]"
            onClick={skipBackward}
          />
        </button> */}
        <button
          className="p-2 inline-block  rounded-full cursor-pointer"
          onClick={skipBackward}
        >
          <TrackPreviousIcon className="h-[1rem] w-[1rem]" />
        </button>
        <button
          onClick={togglePlay}
          className="p-2 inline-block bg-black rounded-full cursor-pointer"
        >
          {isPlaying ? (
            <PauseIcon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <PlayIcon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </button>
        <button className="p-2 inline-block  rounded-full cursor-pointer">
          <TrackNextIcon className="h-[1rem] w-[1rem]" onClick={skipForward} />
        </button>
        {/* <button className="p-2 inline-block  rounded-full cursor-pointer">
          <DoubleArrowRightIcon
            className="h-[1rem] w-[1rem]"
            onClick={skipForward}
          />
        </button> */}
        {/* <button
          className={"p-1.5 inline-block  rounded-md cursor-pointer bg-black"}
          onClick={enableLoop}
        >
          <LoopIcon className="h-[1rem] w-[1rem]" />
        </button> */}
      </div>
    </>
  );
}

export default Controls;
