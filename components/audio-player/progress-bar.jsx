import React from "react";

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

function ProgressBar({ audioRef,progressBarRef, duration, timeProgress }) {
  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs">{formatTime(timeProgress)}</span>
      <input
        ref={progressBarRef}
        type="range"
        defaultValue={0}
        className="w-full"
        onChange={handleProgressChange}
      ></input>
      <span className="text-xs">{formatTime(duration)}</span>
    </div>
  );
}

export default ProgressBar;
