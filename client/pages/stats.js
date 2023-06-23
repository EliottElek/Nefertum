import Link from "next/link";
import { useAppContext } from "../context";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import CustomModal from "../components/Modal";
import { useRouter } from "next/router";
export default function Home() {
  const { setSessionId } = useAppContext();
  const [statsWons, setStatsWons] = useState("__");
  const [statsTopFive, setStatsTopFive] = useState("__");
  const [statsWons2, setStatsWons2] = useState("__");
  const [statsTopFive2, setStatsTopFive2] = useState("__");
  setSessionId(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await supabase.from("games").select("won, top_five");
        const wons = data.filter((d) => d.won);
        const top_five = wons.filter((d) => d.top_five);
        setStatsWons(Math.ceil((wons.length / data.length) * 100));
        setStatsTopFive(Math.ceil((top_five.length / wons.length) * 100));
      } catch (e) {
        console.log(e);
      }
    };
    loadStats();
  }, [setStatsWons, setStatsTopFive]);
  useEffect(() => {
    const loadStats2 = async () => {
      try {
        const { data } = await supabase.from("games2").select("won, top_five");
        const wons = data.filter((d) => d.won);
        const top_five = wons.filter((d) => d.top_five);
        setStatsWons2(Math.ceil((wons.length / data.length) * 100));
        setStatsTopFive2(Math.ceil((top_five.length / wons.length) * 100));
      } catch (e) {
        console.log(e);
      }
    };
    loadStats2();
  }, [setStatsWons2, setStatsTopFive2]);
  return (
    <div className="h-full">
      <Head>
        <title>Nefertum</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <div className="flex flex-col w-full text-center items-center h-full justify-center text-gray-50">
        <h1 className="md:text-5xl text-3xl px-3">Statistics</h1>
        <div className="grid p-10 md:grid-cols-3 grid-cols-1 w-full h-[50vh]">
          <div className="w-full p-10 flex items-center justify-center flex-col">
            <h2 className="text-xl">Matrix version</h2>
            {statsWons !== null && (
              <>
                <h3 className="text-3xl mt-4">
                  <span className="text-[#cf46ca]">{statsWons || 0}%</span>{" "}
                  accuracy
                </h3>
                <span className="mt-4">
                  <span className="text-[#cf46ca]">{statsTopFive || 0}%</span>of
                  those in the top 5 results
                </span>
              </>
            )}
          </div>
          <div className="md:flex hidden justify-center w-full">
            <div className="h-full border w-[1px] border-opacity-30 border-white" />
          </div>
          <div className="w-full p-10 flex items-center justify-center flex-col">
            <h2 className="text-xl">Embeddings version</h2>
            {statsWons2 !== null && (
              <>
                <h3 className="text-3xl mt-4">
                  <span className="text-[#cf46ca]">{statsWons2 || 0}%</span>{" "}
                  accuracy
                </h3>
                <span className="mt-4">
                  <span className="text-[#cf46ca]">{statsTopFive2 || 0}%</span>{" "}
                  of those in the top 5 results
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
