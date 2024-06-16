"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import supabase from "@/config/supabaseClient";
import { Button } from "@/components/appUI/button";
import { Context } from "@/State/stateIndex";
import Fuse from "fuse.js";
import { Input } from "@/components/appUI/input";
import {
  PlayIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/appUI/select";
import { useRouter } from "next/navigation";

export default function ShareFavorite({ params }) {
  const { id } = params;
  const [favorite, setFavorite] = useState([]);
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [podcast, setPodcast] = useState([]);

  async function searchShows(search) {
    setSearch(search);
    if (search === "") {
      setData(podcast);
      return;
    }
    const fuse = new Fuse(data, {
      keys: ["showName"],
    });
    const result = fuse.search(search);
    const searchResult = result.map((item) => item.item);

    setData(searchResult);
  }

  async function sortByTitle(sortType) {
    setIsLoading(true);
    const sortedData = [...data]; // Create a copy of the data array

    if (sortType === "ascending") {
      sortedData.sort((a, b) => a.showName.localeCompare(b.showName));
    } else if (sortType === "descending") {
      sortedData.sort((a, b) => b.showName.localeCompare(a.showName));
    } else if (sortType === "recently-added") {
      sortedData.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    } else if (sortType === "oldest") {
      sortedData.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    } else {
      console.log("Invalid sort type");
    }

    setData(sortedData);
    setIsLoading(false);
  }

  useEffect(() => {
    async function getFavorite() {
      try {
        const { data, error } = await supabase
          .from("favoriteList")
          .select()
          .eq("userId", id);
        if (error) throw error;
        setFavorite(data);
      } catch (error) {
        console.error("Error fetching favorite data:", error.message);
      }
    }

    getFavorite();
  }, [id]);

  useEffect(() => {
    function getUniqueShows(data) {
      const uniqueShowIds = new Set();
      return data.filter((obj) => {
        if (!uniqueShowIds.has(obj.showId)) {
          uniqueShowIds.add(obj.showId);
          return true;
        }
        return false;
      });
    }

    const favoriteData = getUniqueShows(favorite);
    setData(favoriteData);
    setPodcast(favoriteData);
  }, [favorite]);

  return (
    <div className="pt-24 bg-gray-950 min-h-[100vh]">
      <div className="px-4">
        <div className="flex justify-between flex-col sm:flex-row items-center mb-4">
          <h1 className="text-3xl font-semibold my-4">Shared Favorite Shows</h1>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <div className="relative lg:w-[400px]">
              <Input
                type="search"
                value={search}
                onChange={(e) => searchShows(e.target.value)}
                placeholder="Search"
                className="pl-8"
              />
              <MagnifyingGlassIcon
                onClick={() => searchShows(search)}
                className="size-[1.2rem] absolute left-2 top-0 inline-flex items-center h-full"
              />
            </div>
            <Select onValueChange={(e) => sortByTitle(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ascending">A-Z</SelectItem>
                  <SelectItem value="descending">Z-A</SelectItem>
                  <SelectItem value="recently-added">Recently Updated</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {data.length === 0 && (
          <div className="text-center text-2xl font-semibold mt-4">
            No Favorite Podcast
          </div>
        )}
        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8  justify-between">
          {data?.map((show) => (
            <Link
              href={`/favorite/share/${id}/${show?.showId}`}
              key={show?.showId}
              className="flex-col items-center justify-center m-auto"
            >
              <div className="relative h-60 w-60 ">
                <Image
                  fill
                  src={show?.showImage}
                  alt={show?.showName}
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-0.5 mt-3">
                <h6 className="text-base font-medium line-clamp-1">
                  {show?.showName}
                </h6>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
