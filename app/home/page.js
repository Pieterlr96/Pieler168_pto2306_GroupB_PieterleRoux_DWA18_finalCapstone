import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PlayIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

// Dynamically import components using React hooks
const {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} = React.lazy(() => import("@/components/appUI/carousel"));
const {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} = React.lazy(() => import("@/components/appUI/select"));
import { Input } from "@/components/appUI/input";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [podcast, setPodcast] = useState([]);

  // Function to fetch data from the database
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/podcasts`); // Adjust the API route accordingly
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        setData(result);
        setPodcast(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Function to search shows
  async function searchShows(searchTerm) {
    setSearch(searchTerm);
    if (searchTerm === "") {
      setData(podcast);
      return;
    }
    const fuse = new Fuse(data, {
      keys: ['title']
    });
    const result = fuse.search(searchTerm);
    const searchResult = result.map(item => item.item);
    setData(searchResult);
  }

  // Function to sort shows
  async function sortByTitle(sortType) {
    setIsLoading(true);
    const sortedData = [...data]; // Create a copy of data to avoid mutating state directly
    switch (sortType) {
      case "ascending":
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "descending":
        sortedData.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "recently-added":
        sortedData.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case "oldest":
        sortedData.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      default:
        console.log("Invalid sort type");
    }
    setData(sortedData);
    setIsLoading(false);
  }

  return (
    <>
      <div className="w-full bg-gray-950">
        {/* Carousel */}
        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {data.slice(0, 10).map((show, index) => (
              <CarouselItem key={show.id}>
                {/* Render carousel items */}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 !bottom-0" />
          <CarouselNext className="right-0" />
        </Carousel>

        <div className="px-4">
          {/* Search and Sort controls */}
          <div className="flex justify-between flex-col sm:flex-row items-center mb-4">
            <h1 className="text-4xl font-semibold my-4">All Shows</h1>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <div className="relative lg:w-[400px]">
                <Input type="search" value={search} onChange={(e) => searchShows(e.target.value)} placeholder="Search" className="pl-8" />
                <MagnifyingGlassIcon onClick={() => searchShows(search)} className="size-[1.2rem] absolute left-2 top-0 inline-flex items-center h-full" />
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

          {/* Grid of shows */}
          <div className="grid grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 justify-between">
            {data.map((show) => (
              <Link href={`/${show.id}`} key={show.id} className="flex-col items-center justify-center m-auto">
                <div className="relative h-60 w-60">
                  <Image
                    fill
                    src={show.image} // Adjust to use correct image field from the database
                    alt={show.title}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-0.5 mt-3">
                  <h6 className="text-base font-medium line-clamp-1">
                    {show.title}
                  </h6>
                  {/* Update to use correct field from the database */}
                  <p className="text-gray-400 text-sm">Seasons: <span>{show.seasons}</span></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
