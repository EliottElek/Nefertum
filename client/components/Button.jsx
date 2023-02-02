import React from "react";
import { Button } from "@material-tailwind/react";
const ButtonCustom = (props) => {
  return (
    <Button
      {...props}
      className={[
        "bg-[#cf46ca] border-slate-400 rounded-lg focus:outline-none text-gray-200 hover:text-gray-50 hover:border-gray-50",
        props.variant === "text" &&
          "bg-transparent text-[#cf46ca] hover:bg-transparent hover:text-[#cf46ca] ",
      ].join(" ")}
    />
  );
};

export default ButtonCustom;
