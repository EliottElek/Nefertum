import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col max-w-xs">
      <Link href="/game">
        <span
          className={
            "border bg-slate-100 rounded-3xl px-6 py-4 text-sm cursor-pointer font-medium"
          }
        >
          Start a game against Nefertum
        </span>
      </Link>
    </div>
  );
}
