import React, { useState } from "react";

const Data = () => {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/data`);
      const dataRes = await res.json();
      setData(dataRes);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col max-w-xs">
      <button
        onClick={fetchData}
        className="border text-center w-full p-4 rounded-lg bg-green-600 text-slate-50"
      >
        {data ? "Refetch data" : "Fetch data"}
      </button>
      {data && JSON.stringify(data)}
    </div>
  );
};

export default Data;
