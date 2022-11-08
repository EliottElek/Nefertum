import React, { useState } from "react";
import { Table } from "flowbite-react";
const Data = () => {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/data`);
      const dataRes = await res.json();
      setData(dataRes);
      console.log(dataRes);
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
      {data && (
        <Table>
          <Table.Head>
            <Table.HeadCell>Product name</Table.HeadCell>
            <Table.HeadCell>Color</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data &&
              Object.keys(data?.label).forEach((item, i) => (
                <Table.Row
                  key={i}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item}
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      href={data.source[i]}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {data.source[i]}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      href="/tables"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Edit
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default Data;
