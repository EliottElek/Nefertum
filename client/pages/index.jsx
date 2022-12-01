import Link from "next/link";
import ButtonCustom from "../components/Button";
export default function Home() {
  return (
    <div className="flex flex-col max-w-xs">
      <Link href="/game">
        <ButtonCustom variant="gradient">
          Start a game against Nefertum !
        </ButtonCustom>
      </Link>
    </div>
  );
}
