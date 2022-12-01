import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import ButtonCustom from "../components/Button";

const navigation = [{ name: "Play against Nefertum !", href: "/game" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const [bg, setBg] = useState("/bg2.jpg");

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
                        className="h-8 w-8 cursor-pointer"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </Link>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link href={item.href} key={item.name}>
                            <ButtonCustom>{item.name}</ButtonCustom>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-5 hidden md:block">
                    <Menu>
                      <MenuHandler>
                        <Button variant="outlined">Theme</Button>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem onClick={() => setBg("/bg.jpg")}>
                          Background 1
                        </MenuItem>
                        <MenuItem onClick={() => setBg("/bg2.jpg")}>
                          Background 2
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-200 p-2 text-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      "text-gray-800 hover:bg-gray-300 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
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
    </div>
  );
}
