import { router } from "next";
import Link from "next/link";
export default function Home() {
  const startGame = () => {
    // Do the necessary to start the game
    // ------------------- //
    // Redirect to /page
    router.push("/game");
  };
  return (
    <div className="flex flex-col max-w-xs">
      <button
        onClick={startGame}
        className="border text-center w-full p-4 rounded-lg bg-green-600 text-slate-50"
      >
        Play Smell Akinator
      </button>
      <Link href="/data">
        <a
          onClick={startGame}
          className="border p-4 text-center w-full rounded-lg bg-green-600 text-slate-50"
        >
          Get data
        </a>
      </Link>
    </div>
  );
}
