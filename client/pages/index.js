import Link from "next/link";
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
        <Link href="/game">
          <span className="button px-10 py-4 border cursor-pointer rounded-full my-10">
            Start a game
          </span>
        </Link>
      </div>
    </>
  );
}
