import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { supabase } from "../lib/supabase";
import { Table } from "flowbite-react";
import toast from "react-hot-toast";
import Head from "next/head";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
const AddedSources = () => {
  const [sources, setSources] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [mappings, setMappings] = useState(null);

  useEffect(() => {
    const loadAddedSources = async () => {
      try {
        const { data: srcs } = await supabase
          .from("sources")
          .select("name:label,id");
        setSources(srcs);
        const { data: attrs } = await supabase
          .from("attributes")
          .select("name:label,id");
        setAttributes(attrs);
        const { data: res } = await supabase
          .from("sources_attributes")
          .select("source_id, attribute_id");
        setMappings(res);
        setSources(srcs);
      } catch (e) {
        toast.error("An error occured loading the sources.");
      }
    };
    loadAddedSources();
  }, [setSources]);
  return (
    <div>
      <Head>
        <title>Nefertum | Added sources</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <div className="flex max-w-[95%] text-gray-50 max-h-[80vh] flex-col md:max-w-5xl h-full mt-10 items-center justify-center gap-10 rounded-xl bg-white p-10 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
        <Typography variant="h3">Community added sources</Typography>
        {sources?.length === 0 ? (
          <p>No source for the moment.</p>
        ) : (
          <Table className="w-full overflow-auto max-w-lg">
            <Table.Head>
              <Table.HeadCell>Source</Table.HeadCell>
              {attributes &&
                attributes.map((a) => (
                  <Table.HeadCell key={a.id}>{a.name}</Table.HeadCell>
                ))}
            </Table.Head>
            <Table.Body className="divide-y">
              {sources &&
                sources.map((source) => (
                  <Table.Row
                    key={source.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {source.name}
                    </Table.Cell>
                    {attributes?.map((att) => (
                      <Table.Cell className="whitespace-nowrap text-center font-medium text-gray-900 dark:text-white">
                        {mappings?.findIndex(
                          (m) =>
                            m.source_id === source.id &&
                            m.attribute_id === att.id
                        ) !== -1 ? (
                          <CheckIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="w-5 h-5 text-red-500" />
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AddedSources;
