import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import ButtonCustom from "../components/Button";
import { useAppContext } from "../context";
export default function Home() {
  const { setSessionId } = useAppContext();
  setSessionId(null);
  return (
    <div className="flex text-gray-50 flex-col max-w-xl h-full mt-10 items-center justify-center gap-10 rounded-xl bg-white p-10 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
      <Typography variant="h2">Welcome to Nefertum !</Typography>
      <Typography variant="paragraph">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus ad
        reprehenderit omnis perspiciatis aut odit! Unde architecto perspiciatis,
        dolorum dolorem iure quia saepe autem accusamus eum praesentium magni
        corrupti explicabo!
      </Typography>
      <Link href="/game">
        <ButtonCustom variant="gradient">
          Start a game against Nefertum !
        </ButtonCustom>
      </Link>
    </div>
  );
}
