"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Context } from "@/context";
import moment from "moment";
import Player from "@/components/audio-player/player";
import FavoriteEpisode from "@/components/favorite/favorite-episode";
import { useRouter } from "next/navigation";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export default function FavoriteById({ params }) {
  const [reload, setReload] = useState(false);
  const {
    state: { user },
  } = useContext(Context);
  const router = useRouter();
  const [data, setData] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const getFavoriteById = async () => {
    const { data, error } = await supabase
      .from("favoriteList")
      .select()
      .eq("userId", user.email)
      .eq("showId", params.id);
    const groupedArray = {};
    data.forEach((obj) => {
      const seasonNo = obj.seasonNo;
      if (!groupedArray[seasonNo]) {
        groupedArray[seasonNo] = {
          season: seasonNo,
          episodes: [],
        };
      }
      groupedArray[seasonNo].episodes.push(obj);
    });
    return Object.values(groupedArray);
  };

  useEffect(() => {
    async function getData(id) {
      const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);

      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
      }

      const result = await res.json();
      // console.log("--->", result.seasons);
      const updatedArray = await getFavoriteById();
      // console.log("updatedArray -----> ", updatedArray);
      const temp = result.seasons.filter((season) => {
        const found = updatedArray.find((item) => item.season == season.season);
        if (found) {
          return true;
        }
      });
      // console.log("temp -----> ", temp);
      result.seasons = temp;
      setData(result);
      setFavorite(updatedArray);
    }
    getData(params?.id);
  }, [reload]);

  useEffect(()=>{
    if(!user){
      router.push('/')
    }
  },[user])

  if (data.length === 0) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <h1 className="text-4xl text-rose-400 ">loading...</h1>
      </div>
    );
  }
  return (
    <div className="pt-[65px] bg-gray-950 min-h-[100vh]">
      <Link href="/favorite" >
        <Button className="flex items-center ml-4" size='sm'>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-4">
        <div className=" ">
          <div className="h-60 relative w-auto aspect-auto">
            <Image
              priority
              fill
              className="w-full h-full"
              src={data?.image}
              alt={data?.title}
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">{data?.title}</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Genres:</span>{" "}
            <div className="flex gap-1 items-center">
              {data?.genres?.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          <p className="">{data?.description}</p>
          <p>
            <span className="text-sm mr-2 font-medium">Last updated:</span>{" "}
            {data?.updated ? moment(data?.updated).format("LL") : null}{" "}
          </p>
          {data?.seasons?.length != 0 ? (
            <Tabs defaultValue={1} className="">
              <TabsList className="flex-wrap justify-start h-auto w-full">
                {data?.seasons?.map((season) => (
                  <TabsTrigger key={season?.season} value={season?.season}>
                    {season?.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {data?.seasons?.map((season) => (
                <TabsContent key={season?.season} value={season?.season}>
                  <ul className="py-3">
                    {season?.episodes?.map((episode) => (
                      <FavoriteEpisode
                        key={episode?.episode}
                        episode={episode}
                        season={season}
                        showId={params?.id}
                        showName={data?.title}
                        reload={reload}
                        setReload={setReload}
                      />
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          ):(
            <h1 className="text-center text-3xl mt-3 text-red-400">
                No Episode in Favorite 
            </h1>
          )
        }
        </div>
      </div>
    </div>
  );
}
