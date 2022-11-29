import React, { useState } from "react";
import { Table } from "flowbite-react";
const Questions = () => {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/questions`);
      const dataRes = await res.json();
      setData(dataRes);
      console.log(dataRes);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col w-full gap-8 z-0 p-4">
      <button
        onClick={fetchData}
        className="border text-center max-w-xs p-4 rounded-lg bg-green-600 text-slate-50"
      >
        {data ? "Refetch data" : "Fetch data"}
      </button>
      {data && (
        <Table hoverable striped>
          <Table.Head>
            <Table.HeadCell>Attribute</Table.HeadCell>
            <Table.HeadCell>Label</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data?.data.map((row) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {row.attribute}
                </Table.Cell>
                <Table.Cell>{row.label}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-gray-400 dark:text-blue-500">
                    Edit
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default Questions;
