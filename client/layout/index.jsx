import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Typography } from "@material-tailwind/react";
import CustomModal from "../components/Modal";
import { useAppContext } from "../context";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  // expected output: 0, 1 or 2
  const [bg, setBg] = useState("bg7.jpg");
  const [openModal, setOpenModal] = useState(false);
  const { sessionId } = useAppContext();

  const newGame = () => {
    if (!sessionId) {
      router.push("/game");
      return;
    }
    setOpenModal(true);
  };
  return (
    <div
      style={{ maxHeight: "-webkit-fill-available" }}
      className="p-16 h-screen  overflow-y-auto overflow-x-hidden flex items-center justify-start flex-col w-full bg-cover relative bg-gradient-to-r from-[#2b333b] to-[#516170]"
      // style={{ backgroundImage: `url("${bg}")` }}
    >
      <Disclosure as="nav" className="fixed w-full top-0 z-10">
        {({ open }) => (
          <>
            <div className="mx-auto p-3 text-gray-50">
              <div className="flex h-16 items-center w-full justify-between">
                <div className="items-center fixed md:left-10 right-0  hidden md:flex">
                  <Link href="/">
                    <img
                      className="h-12 cursor-pointer"
                      src="logo-white-ft2.png"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="items-center gap-12 fixed right-10 hidden md:flex">
                  <Link href="/">
                    <span className="cursor-pointer hover:underline">Home</span>
                  </Link>
                  <button onClick={newGame}>
                    <span className="cursor-pointer hover:underline">
                      New game
                    </span>
                  </button>
                  <Link href="/add-source">
                    <span className="cursor-pointer hover:underline">
                      Add a source
                    </span>
                  </Link>
                  <a
                    target="_blank"
                    href="https://github.com/EliottElek/Nefertum"
                    className="flex text-gray-50 items-center gap-2 hover:underline"
                  >
                    Github{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="fill-gray-50"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
                <div className="flex justify-between w-full md:hidden">
                  <Link href="/">
                    <img
                      className="h-12 cursor-pointer"
                      src="logo-white-ft2.png"
                      alt=""
                    />
                  </Link>
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg p-2 text-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="md:hidden flex flex-col p-4 items-start gap-3 text-gray-50 bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
              <Link href="/feedback">
                <span className="cursor-pointer hover:underline">
                  Give us feedback
                </span>
              </Link>
              <Link href="/">
                <span className="cursor-pointer hover:underline">Home</span>
              </Link>
              <button onClick={newGame}>
                <span className="cursor-pointer hover:underline">New game</span>
              </button>
              <Link href="/add-source">
                <span className="cursor-pointer hover:underline">
                  Add a source
                </span>
              </Link>
              <a
                href="https://github.com/EliottElek/Nefertum"
                className="flex text-gray-50 items-center gap-2 cursor-pointer hover:underline"
              >
                Github{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-gray-50"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <div className="mr-2 fixed right-0 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {children}
      <div className="fixed hidden md:flex items-center bottom-0 h-16 left-10">
        <Link href="/feedback">
          <span className="cursor-pointer text-gray-50 hover:underline">
            Give us feedback
          </span>
        </Link>
      </div>
      <div className="fixed text-gray-50 gap-1 hidden md:flex bottom-0 items-center h-16 right-10">
        Powered by{" "}
        <a
          href="https://odeuropa.eu/"
          className="flex underline items-center gap-2"
        >
          Odeuropa
        </a>
      </div>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        title={"Your progress will be lost."}
        onSubmit={() => window.location.reload()}
        submitBtnLabel={"Start a new game"}
        cancelBtnLabel={"Finish this game"}
        onCancel={() => {}}
      >
        If you start a new game against Nefertum, all your progress for this
        session will be lost.
        <br />
        <Typography variant="h6" className="pt-5">
          Are you sure you want to continue ?
        </Typography>
      </CustomModal>
    </div>
  );
}
