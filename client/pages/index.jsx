import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import { NewGameCard, AddSourceCard, FeedBackCard } from "../components/Card";
import { useAppContext } from "../context";
import Head from "next/head";
export default function Home() {
  const { setSessionId } = useAppContext();
  setSessionId(null);
  return (
    <>
      <Head>
        <title>Nefertum</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <div className="flex flex-col max-w-2xl text-center items-center justify-center text-gray-50">
        <h1 className="text-6xl uppercase">Nefertum</h1>
        <h4 className="text-2xl my-10">Odeuropa's guessing game for smells.</h4>
        <p>
          Ire mille, inpatiens. Suis si tellus: eius plenum studiosus pectora
          flammaeque credar sola mentisque statione Medon! Lingua ut pectore
          oscula. Noviens mors quem omnia, ferunt subitisque latus, Nox ingemuit
          quod aratos solis. Inclusum illa petebatur cuique vates Andraemon
          Ulixes, iam vina, miserrima.
        </p>
        <Link href="/game">
          <span className="px-10 py-4 border-2 cursor-pointer rounded-full my-10">Start a game</span>
        </Link>
      </div>
    </>
  );
}
