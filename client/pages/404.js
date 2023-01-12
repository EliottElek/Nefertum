import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import ButtonCustom from "../components/Button";
import { useAppContext } from "../context";
import Head from "next/head";
export default function ErrorPage() {
  const { setSessionId } = useAppContext();
  setSessionId(null);
  return (
    <>
      <Head>
        <title>Nefertum | 404</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <div className="flex max-w-[95%] text-gray-50 flex-col md:max-w-xl h-full mt-10 items-center justify-center gap-10 rounded-xl bg-white p-10 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
        <Typography variant="h2">404 Error</Typography>
        <Typography variant="paragraph">
          The page you requested was not found. Go back home.
        </Typography>
        <Link href="/">
          <ButtonCustom variant="gradient">Get back home</ButtonCustom>
        </Link>
      </div>
    </>
  );
}
