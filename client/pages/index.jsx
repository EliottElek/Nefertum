import { router } from "next";

export default function Home() {
  const startGame = () => {
    // Do the necessary to start the game
    // ------------------- //
    // Redirect to /page
    router.push("/game");
  };
  return (
    <button
      onClick={startGame}
      className="border p-4 rounded-lg bg-green-600 text-slate-50"
    >
      Play Smell Akinator
    </button>
  );
}
