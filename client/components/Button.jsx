import React from "react";

const Button = (props) => {
  return (
    <button
      {...props}
      className={[
        "px-4 py-2 border border-slate-400 rounded-lg text-slate-200 hover:text-slate-50 hover:border-slate-50",
      ]}
    />
  );
};

export default Button;
