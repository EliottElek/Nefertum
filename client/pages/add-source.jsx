import React, { useEffect, useState } from "react";
import CustomModal from "../components/Modal";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import AutoCompleteSource from "../components/AutoCompleteSource";
import AutoCompleteAttributes from "../components/AutoCompleteAttributes";
import { toast, Toaster } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import axios from "axios";
import { supabase } from "../lib/supabase";
import Tabs, { Tab } from "../components/Tabs";
const wrongSource = () => {
  const [openModal, setOpenModal] = useState(true);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState(null);
  const [attributes, setAttributes] = useState(null);
  // selected source
  const [selectedSource, setSelectedSource] = useState(null);
  const [value, setValue] = useState("");
  // selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (openModal === false) router.push("..");
  }, [openModal, router]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sources`
        );
        setSources(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchSources();
  }, [setSources]);
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/attributes`
        );
        setAttributes(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAttributes();
  }, [setAttributes]);

  const onSubmit = async () => {
    setLoading(true);
    if (!selectedSource && value === "") {
      setMessage("You must selected a source.");
      setLoading(false);
      return;
    }
    if (selectedAttributes.length === 0) {
      setMessage(
        `You must select at least one attribute that describes "${selectedSource.label}"`
      );
      setLoading(false);
      return;
    }
    try {
      const { data: source } = await supabase
        .from("sources")
        .upsert(
          { label: value !== "" ? value : selectedSource.label },
          { onConflict: "label" }
        )
        .select("id")
        .single();

      const a = selectedAttributes.map((source) => {
        return {
          label: source.label,
        };
      });
      const { data: attribs } = await supabase
        .from("attributes")
        .upsert(a, { onConflict: "label" })
        .select("id");
      // we have attributes ids [{id : "1" }, {id : "2" }, {id : "3" }]
      // we have source id : {id : 1}
      for (let i = 0; i < attribs.length; i++) {
        // check if relation already exists
        const { data: relation } = await supabase
          .from("sources_attributes")
          .select("id")
          .match({ source_id: source.id, attribute_id: attribs[i].id });
        if (relation.length === 0)
          await supabase
            .from("sources_attributes")
            .insert({ source_id: source.id, attribute_id: attribs[i].id });
      }
      setLoading(false);
      toast.success("Your results were successfully submitted.");
      setTimeout(() => {
        router.push("/added-sources");
      }, 2000);
    } catch (e) {
      toast.error("An error occured submitting your results.");
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <Head>
        <title>Nefertum | Add a source</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <CustomModal
        submitBtnLabel={
          loading ? (
            <>
              <Spinner color="purple" size="sm" />
              <span className="pl-3">Submitting...</span>
            </>
          ) : (
            "Submit your answer"
          )
        }
        cancelBtnLabel={"Cancel"}
        title={"Add a source"}
        open={openModal}
        setOpen={setOpenModal}
        onCancel={() => {
          router.push("..");
        }}
        onSubmit={onSubmit}
      >
        <div className="overflow-auto min-h-[50vh]">
          <Tabs>
            <Tab title="From database">
              <span className="text-red-500">{message}</span>
              <Typography variant="paragraph">
                Please tell us what you were thinking of, so that we can do
                better next time.
              </Typography>
              <AutoCompleteSource
                sources={sources}
                selected={selectedSource}
                setSelected={setSelectedSource}
              />
              <Typography variant="paragraph" className="pt-8">
                Select every adjective that can describe your source.
              </Typography>
              <AutoCompleteAttributes
                sources={attributes}
                selected={selectedAttributes}
                setSelected={setSelectedAttributes}
              />
            </Tab>
            <Tab title="from scratch">
              <span className="text-red-500">{message}</span>
              <Typography variant="paragraph">
                Please add the source you were thinking of, if you couldn't find
                it in the databse.
              </Typography>
              <input
                className="w-full border rounded p-2 px-2 text-sm mt-2"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="The name of your source..."
              />
              <Typography variant="paragraph" className="pt-8">
                Select every adjective that can describe your source.
              </Typography>
              <AutoCompleteAttributes
                sources={attributes}
                selected={selectedAttributes}
                setSelected={setSelectedAttributes}
              />
            </Tab>
          </Tabs>
        </div>

        {/* <Toaster /> */}
      </CustomModal>
    </div>
  );
};

export default wrongSource;
