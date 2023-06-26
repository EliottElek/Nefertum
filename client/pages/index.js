import Link from "next/link";
import { useAppContext } from "../context";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import CustomModal from "../components/Modal";
import { useRouter } from "next/router";
export default function Home() {
  const { setSessionId } = useAppContext();
  const [openStart, setOpenStart] = useState(false);
  const [version, setVersion] = useState("matrix");

  const router = useRouter();
  setSessionId(null);

  return (
    <div className="h-full">
      <Head>
        <title>Nefertum</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <div className="flex flex-col max-w-2xl text-center items-center h-full justify-center text-gray-50">
        <h1 className="md:text-8xl text-5xl px-3">Nefertum</h1>
        <p className="mt-4 p-4">
          Introducing Nefertum, the ultimate smell guessing game! Just like
          Akinator, but for smells. Challenge yourself and your friends to see
          if Nefertum can correctly identify a variety of scents, from the sweet
          aroma of fresh flowers to the pungent smell of spices. With Nefertum,
          you'll never run out of new smells to guess and discover. Play now and
          see how many it can get right!
        </p>
        {/* {stats && (
          <h3 className="text-xl mt-4">
            <span className="text-[#cf46ca]">{stats}%</span> accuracy (still
            learning)
          </h3>
        )} */}
        <div className="grid grid-cols-2 w-full justify-center gap-5">
          <button
            onClick={() => {
              setVersion("matrix");
              setOpenStart(true);
            }}
          >
            <span className="button w-full px-10 py-4 border cursor-pointer rounded-full ">
              Start (matrix)
            </span>
          </button>
          <button
            onClick={() => {
              setVersion("embeddings");
              setOpenStart(true);
            }}
          >
            <span className="button w-full px-10 py-4 border cursor-pointer rounded-full">
              Start (embeddings)
            </span>
          </button>
        </div>
      </div>
      <CustomModal
        submitBtnLabel={"Ready !"}
        cancelBtnLabel={null}
        title={"Think about a smell..."}
        open={openStart}
        setOpen={setOpenStart}
        onSubmit={() =>
          version === "embeddings"
            ? router.push("/v2/game")
            : router.push("/game")
        }
      >
        <div className="flex flex-col items-start !font-sans font-bold">
          Close your eyes and think of a smell. It can be anything, from your
          favorite flower to the scent of freshly baked cookies. Whenever you're
          ready to play, click on the "Ready" button below.
        </div>
      </CustomModal>
    </div>
  );
}
