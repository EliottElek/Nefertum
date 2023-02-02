import Link from "next/link";
import { useAppContext } from "../context";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function Home() {
  const { setSessionId } = useAppContext();
  const [stats, setStats] = useState("__");
  setSessionId(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await supabase.from("games").select("won");
        const wons = data.filter((d) => d.won);
        setStats(Math.ceil((wons.length / data.length) * 100));
      } catch (e) {
        console.log(e);
      }
    };
    loadStats();
  }, [setStats]);
  return (
    <>
      <Head>
        <title>Nefertum</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <div className="flex flex-col max-w-2xl text-center items-center h-screen justify-center text-gray-50">
        <h1 className="md:text-8xl text-5xl px-3">Nefertum</h1>
        <p className="mt-4">
          Introducing Nefertum, the ultimate smell guessing game! Just like
          Akinator, but for smells. Challenge yourself and your friends to see
          if Nefertum can correctly identify a variety of scents, from the sweet
          aroma of fresh flowers to the pungent smell of spices. With Nefertum,
          you'll never run out of new smells to guess and discover. Play now and
          see how many it can get right!
        </p>
        {stats && (
          <h3 className="text-xl mt-4">
            <span className="text-[#cf46ca]">{stats}%</span> accuracy (still
            learning)
          </h3>
        )}
        <Link href="/game">
          <span className="button px-10 py-4 border cursor-pointer rounded-full my-10">
            Start a game
          </span>
        </Link>
      </div>
    </>
  );
}
