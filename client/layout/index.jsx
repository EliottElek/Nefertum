import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Logo from "../public/logo.svg";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
} from "@material-tailwind/react";
import ButtonCustom from "../components/Button";
import CustomModal from "../components/Modal";
import { useAppContext } from "../context";
import { useRouter } from "next/router";
const navigation = [{ name: "New game", href: "/game" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
      className="min-h-screen w-full bg-cover"
      style={{ backgroundImage: `url("${bg}")` }}
    >
      <Disclosure as="nav" className="bg-transparent sticky top-0 z-10">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <div className="flex-shrink-0 flex items-center pt-4">
                    <Link href={"/"}>
                      <img
                        className="w-12 h-12 cursor-pointer"
                        src={"/logo.svg"}
                        alt="An SVG of an eye"
                      />
                    </Link>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <ButtonCustom onClick={newGame}>
                          New game !
                        </ButtonCustom>
                      </div>
                    </div>
                  </div>
                  <div className="pt-5 hidden md:block">
                    <Menu>
                      <MenuHandler>
                        <Button color="purple">Theme</Button>
                      </MenuHandler>
                      <MenuList>
                        {["", "2", "3", "4", "5", "6", "7"].map((bgItem) => (
                          <MenuItem onClick={() => setBg(`/bg${bgItem}.jpg`)}>
                            <img
                              src={`/bg${bgItem}.jpg`}
                              className="h-14 w-full object-cover"
                            />
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </div>
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
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <ButtonCustom style={{ width: "100%", marginTop: "12px" }}>
                      {item.name}
                    </ButtonCustom>
                  </Disclosure.Button>
                ))}
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
