"use client";
import { Badge } from "@/components/appUI/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/appUI/tabs";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "@/components/appUI/button";
import { Context } from "@/State/stateIndex";
import moment from "moment";
import ShareFavoriteEpisode from "@/components/favorite/share-favorite";
import supabase from "@/config/supabaseClient"; // Import Supabase client

export default function FavoriteByIdForShare({ params }) {
  const [reload, setReload] = useState(false);
  const { id, showId } = params;

  const [data, setData] = useState(null); // Change initial state to null
  const [loading, setLoading] = useState(true);
  const { user } = useContext(Context);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from Supabase
        const { data: favoriteList, error } = await supabase
          .from("favoriteList")
          .select()
          .eq("showId", showId)
          .eq("userId", user.id); // Use user.id instead of decodeURIComponent(id)

        if (error) throw error;

        // Fetch additional data about the podcast
        const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();

        // Update the state with the fetched data
        setData({ favoriteList, podcast: result });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reload, user, id, showId]);

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <h1 className="text-4xl text-rose-400 ">Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <h1 className="text-4xl text-rose-400">No Data Found</h1>
      </div>
    );
  }

  const { favoriteList, podcast } = data;

  return (
    <div className="pt-[65px] bg-gray-950 min-h-[100vh]">
      <Link href={`/favorite/share/${id}`}>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-4">
        <div className=" ">
          <div className="h-60 relative w-auto aspect-auto">
            <Image
              priority
              fill
              className="w-full h-full"
              src={podcast?.image}
              alt={podcast?.title}
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">{podcast?.title}</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Genres:</span>{" "}
            <div className="flex gap-1 items-center">
              {podcast?.genres?.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          <p className="">{podcast?.description}</p>
          <p>
            <span className="text-sm mr-2 font-medium">Last updated:</span>{" "}
            {podcast?.updated ? moment(podcast?.updated).format("LL") : null}{" "}
          </p>
          {favoriteList?.length !== 0 ? (
            <Tabs defaultValue={1} className="">
              <TabsList className="flex-wrap justify-start h-auto w-full">
                {favoriteList?.map((season) => (
                  <TabsTrigger key={season?.seasonNo} value={season?.seasonNo}>
                    {season?.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {favoriteList?.map((season) => (
                <TabsContent key={season?.seasonNo} value={season?.seasonNo}>
                  <ul className="py-3">
                    {season?.episodes?.map((episode) => (
                      <ShareFavoriteEpisode
                        key={episode?.episode}
                        episode={episode}
                        season={season}
                        showId={showId}
                        showName={podcast?.title}
                        reload={reload}
                        setReload={setReload}
                      />
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <h1 className="text-center text-3xl mt-3 text-red-400">
              No Episode in Favorite
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
