import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy search
import {
  PlayIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

// Lazy imports for Carousel and Select components
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
  const router = useRouter();
  const [data, setData] = useState([]);
  const [podcast, setPodcast] = useState([]); // Added state for original podcast data
  const [search, setSearch] = useState(""); // Added state for search term
  const [isLoading, setIsLoading] = useState(false); // Added state for loading indicator

  useEffect(() => {
    // Function to fetch data from the database
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const res = await fetch(`/api/podcasts`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        setData(result);
        setPodcast(result); // Store the original data
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, []);

  // Function to search shows
  async function searchShows(searchTerm) {
    setSearch(searchTerm);
    if (searchTerm === "") {
      setData(podcast); // Reset data to original if search term is empty
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
  function sortByTitle(sortType) {
    setIsLoading(true);
    const sortedData = [...data];
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
        setIsLoading(false); // Stop execution and reset loading state
        return; // Exit the function for invalid sort type
    }
    setData(sortedData);
    setIsLoading(false);
  }

  // Render function remains unchanged
}