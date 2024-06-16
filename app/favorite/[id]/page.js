"use client";

import { Badge } from "@/components/appUI/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/appUI/tabs";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import supabase from "@/config/supabaseClient";
import { Button } from "@/components/appUI/button";
import { Context } from "@/State/stateIndex";
import moment from "moment";
import FavoriteEpisode from "@/components/favorite/favorite-episode";
import { useRouter } from "next/navigation";

export default function FavoriteById({ params }) {
  const [reload, setReload] = useState(false);
  const [data, setData] = useState(null);
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state: { user } } = useContext(Context);
  const router = useRouter();

  const getFavoriteById = async () => {
    const { data, error } = await supabase
      .from("favoriteList")
      .select()
      .eq("userId", user.id)
      .eq("showId", params.id);

    if (error) throw error;

    const groupedArray = data.reduce((acc, obj) => {
      const { seasonNo } = obj;
      if (!acc[seasonNo]) {
        acc[seasonNo] = { season: seasonNo, episodes: [] };
      }
      acc[seasonNo].episodes.push(obj);
      return acc;
    }, {});

    return Object.values(groupedArray);
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchData = async (id) => {
      try {
        const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const result = await res.json();
        const updatedArray = await getFavoriteById();

        const filteredSeasons = result.seasons.filter(season =>
          updatedArray.some(item => item.season === season.season)
        );

        result.seasons = filteredSeasons;
        setData(result);
        setFavorite(updatedArray);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchData(params.id);
    }
  }, [params?.id, reload, user, router]);

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <h1 className="text-4xl text-rose-400">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <h1 className="text-4xl text-rose-400">{error}</h1>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <h1 className="text-4xl text-rose-400">No Data Found</h1>
      </div>
    );
  }

  return (
    <div className="pt-[65px] bg-gray-950 min-h-[100vh]">
      <Link href="/favorite">
        <Button className="flex items-center ml-4" size="sm">
          <Image
            src="https://cdn-icons-png.flaticon.com/128/2099/2099238.png"
            alt="icon"
            height={20}
            width={20}
            className="mr-2"
          />
          Back
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-4">
        <div className="">
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
            <span className="text-sm font-medium">Genres:</span>
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
            <span className="text-sm mr-2 font-medium">Last updated:</span>
            {data?.updated ? moment(data?.updated).format("LL") : null}
          </p>
          {data?.seasons?.length ? (
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
