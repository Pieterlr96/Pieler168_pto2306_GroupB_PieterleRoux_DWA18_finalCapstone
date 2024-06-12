import React from "react";
import {
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon,
} from "@radix-ui/react-icons";

function Volume({ volume, setVolume, muteVolume, setMuteVolume }) {
  return (
    <div className="flex justify-end items-center gap-4 h-full">
      <button onClick={() => setMuteVolume((prev) => !prev)}>
        {muteVolume || volume < 5 ? (
          <SpeakerOffIcon className="h-[1.2rem] w-[1.2rem]" />
        ) : volume < 40 ? (
          <SpeakerModerateIcon className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <SpeakerLoudIcon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </button>

      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(e.target.value)}
      />
    </div>
  );
}

export default Volume;
