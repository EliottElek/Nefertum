import React from "react";
import { Spinner } from "flowbite-react";
const Backdrop = () => {
  return (
    <div className="z-50 fixed inset-0 h-screen w-screen flex flex-col items-center justify-center bg-gray-500/60">
      <Spinner aria-label="Default status example" size="xl" />
    </div>
  );
};

export default Backdrop;
