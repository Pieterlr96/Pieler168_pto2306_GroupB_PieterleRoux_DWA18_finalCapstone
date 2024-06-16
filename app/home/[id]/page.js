"use Client";

import React from "react";
import { Badge } from "@/components/appUI/badge";
const { Tabs, TabsContent, TabsList, TabsTrigger } = React.lazy(() =>
  import("@/components/appUI/tabs")
);
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import Episode from "@/components/episode";
import { Button } from "@/components/appUI/button";
import { waveform } from "ldrs";
import supabase from "@/config/supabaseClient"; 
waveform.register();

export default function Page({ params }) {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function getData(id) {
      try {
        const { data, error } = await supabase
          .from("podcasts")
          .select("*")
          .eq("id", id)
          .single(); 
        if (error) {
          console.error("Error fetching podcast data:", error.message);
          throw error;
        }
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching podcast data:", error.message);
        router.push("/");
      }
    }
    getData(params?.id);
  }, [params, router]);

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <l-waveform size="35" stroke="3.5" speed="1" color="white"></l-waveform>
      </div>
    );
  }

  return (
    <div className="pt-[65px] bg-gray-950">
      <Link href="/">
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
              src={data?.image}
              alt={data?.title}
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">{data?.title}</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Genres:</span>{" "}
            <div className="flex gap-2 items-center flex-wrap">
              {data?.genres?.map((genre) => (
                <Badge key={genre} variant="outline" className='break-words text-center'>
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
                    <Episode
                      key={episode?.episode}
                      episode={episode}
                      season={season}
                      showId={params?.id}
                      showName={data?.title}
                      showImage={data?.image}
                      updated={data?.updated}
                    />
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      {/* <Player /> */}
    </div>
  );
}
