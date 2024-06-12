"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect , useState } from "react";
import Image from "next/image";
import {
  PlayIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay"
import Fuse from 'fuse.js'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

import Link from "next/link";
import { Input } from "@/components/ui/input";



export default  function HomePage() {
  // const data =
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [podcast, setPodcast] = useState([]);

  
  async function searchShows(search) {
    setSearch(search);
    if(search === "") {
      setData(podcast);
      return;
    }
    const fuse = new Fuse(data, {
      keys: [
        'title',
      ]
    });
    const result =  fuse.search(search);
    const searchResult =  result.map((item) => item.item);

    setData(searchResult);
  }
  async function sortByTitle(sortType) {
    setIsLoading(true);
    const sortedData = data;
    if (sortType === "ascending") {
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "descending") {
       sortedData.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortType === "recently-added") {
      sortedData.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    } else if(sortType === "oldest"){
      sortedData.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }else {
      console.log("Invalid sort type");
    }
    setData(sortedData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  useEffect(() => {
    async function getData() {
      const res = await fetch(`https://podcast-api.netlify.app/shows`);
      // The return value is *not* serialized
      // You can return Date, Map, Set, etc.
    
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
      }
    
      return res.json();
    }
    getData().then((data) => {
      setData(data);
      console.log('datat',data.length)
      setPodcast(data);
    });
    
  }, []);

  // console.log("Data: ", data);
  return (
    <>
      <div className="w-full bg-gray-950">
        <Carousel opts={{ loop: true }} className="w-full ">
          <CarouselContent >
            {Array.isArray(data) &&
              data.slice(0, 10).map((show, index) => (
                <CarouselItem key={show?.id}>
                  <div className="h-screen  pt-24 sm:pt-0 bg-gray-950 relative px-4 flex flex-col sm:flex-row sm:justify-between items-center">
                    <div className="sm:w-5/12 flex flex-col sm:gap-4 gap-1 z-10 mb-2">
                      <div className="text-lg font-semibold text-cyan-400">
                        #{index + 1} Spotlight
                      </div>
                      <h2 className="lg:text-5xl md:text-3xl sm:text-2xl text-xl font-semibold">{show?.title}</h2>
                      <p className="text-base line-clamp-3">
                        {show?.description}
                      </p>
                      <div className="flex gap-4 items-center">
                        <Link href={`/${show?.id}`} className="flex gap-2">
                          {/* <PlayIcon className="h-[1.2rem] w-[1.2rem] " /> */}
                          View Detail{" "}
                        </Link>
                        {/* <Button size='sm'>
                          
                          <ChevronRightIcon className="h-[1.2rem] w-[1.2rem] " />
                        </Button> */}
                      </div>
                    </div>
                    <div className="sm:w-1/2 relative sm:absolute right-0 h-auto aspect-video overflow-hidden">
                      <Image
                        priority
                        // 
                        width={300}
                        height={300}
                        src={show?.image}
                        className=" w-full h-full"
                        alt="something went wrong"
                      />
                      {/* <div className="w-full h-full absolute top-0 left-0 z-0 bg-gradient-to-r from-gray-950 from-20% "></div> */}
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 !bottom-0" />
          <CarouselNext className="right-0" />
        </Carousel>

        <div className="px-4">
          <div className="flex justify-between flex-col sm:flex-row items-center mb-4">
            <h1 className="text-4xl font-semibold my-4">All Shows</h1>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <div className="relative lg:w-[400px]">
                <Input type="search" value={search}  onChange={(e)=>searchShows(e.target.value)} placeholder="Search" className="pl-8" />
                <MagnifyingGlassIcon onClick={()=>searchShows(search)} className="size-[1.2rem] absolute left-2 top-0 inline-flex items-center h-full" />
              </div>
              <Select onValueChange={(e) => sortByTitle(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ascending">A-Z</SelectItem>
                    <SelectItem value="descending">Z-A</SelectItem>
                    <SelectItem value="recently-added">
                      Recently Updated
                    </SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8  justify-between">
            {data?.map((show) => (
              <Link href={`/${show?.id}`} key={show?.id} className="flex-col items-center justify-center m-auto">
                <div className="relative h-60 w-60">
                  <Image
                    fill
                    src={show?.image}
                    alt={show?.title}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-0.5 mt-3">
                  <h6 className="text-base font-medium line-clamp-1">
                    {show?.title}
                  </h6>
                  <p className="text-gray-400 text-sm">
                    Seasons: <span>{show?.seasons}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
