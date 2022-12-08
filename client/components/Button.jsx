import React from "react";
import { Button } from "@material-tailwind/react";
const ButtonCustom = (props) => {
  return (
    <Button
      color="purple"
      {...props}
      className={
        "px-4  py-3  border-slate-400 rounded-lg focus:outline-none text-gray-200 hover:text-gray-50 hover:border-gray-50"
      }
    />
  );
};

export default ButtonCustom;
