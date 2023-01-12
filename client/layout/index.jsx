import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import Link from "next/link";
import { Typography } from "@material-tailwind/react";
import ButtonCustom from "../components/Button";
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
      className="min-h-screen w-full bg-cover relative"
      style={{ backgroundImage: `url("${bg}")` }}
    >
      <Disclosure as="nav" className="bg-transparent sticky top-0 z-10">
        {({ open }) => (
          <>
            <div className="mx-auto px-10 p-3 text-gray-50">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <Link href="/feedback">
                    <span className="cursor-pointer hover:underline">
                      Give us feedback
                    </span>
                  </Link>
                </div>
                <div className="flex items-center gap-12">
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
                </div>
                <div className="-mr-2 flex md:hidden">
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

            <Disclosure.Panel className="md:hidden bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                <ButtonCustom style={{ width: "100%", marginTop: "12px" }}>
                  <span className="flex justify-center items-center gap-2">
                    New game
                    <PlusCircleIcon className="w-5 h-5" />
                  </span>
                </ButtonCustom>
                <Link href="/add-source">
                  <ButtonCustom
                    variant="outlined"
                    style={{ width: "100%", marginTop: "12px" }}
                  >
                    <span className="flex items-center gap-2  justify-center">
                      Cannot find a source ? Add it{" "}
                      <PlusCircleIcon className="w-5 h-5" />
                    </span>
                  </ButtonCustom>
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="mx-auto w-full min-h-[80vh]  justify-center max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col items-center">
        {children}
      </main>
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
        session will be lost. (session id : {sessionId})<br />
        <Typography variant="h6" className="pt-5">
          Are you sure you want to continue ?
        </Typography>
      </CustomModal>
    </div>
  );
}
