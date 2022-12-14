import React, { useEffect, useState } from "react";
import CustomModal from "../components/Modal";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import AutoCompleteSource from "../components/AutoCompleteSource";
import AutoCompleteAttributes from "../components/AutoCompleteAttributes";

import { Spinner } from "flowbite-react";

import axios from "axios";
const wrongSource = () => {
  const [openModal, setOpenModal] = useState(true);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [sources, setSources] = useState(null);
  const [attributes, setAttributes] = useState(null);
  // selected source
  const [selectedSource, setSelectedSource] = useState(null);
  // selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (openModal === false) router.push("..");
  }, [openModal, router]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axios.get("http://localhost:5000/sources");
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
        const res = await axios.get("http://localhost:5000/attributes");
        setAttributes(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAttributes();
  }, [setAttributes]);

  const onSubmit = async () => {
    setLoading(true);
    if (!selectedSource) {
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
      console.log({
        source: selectedSource,
        attributes: selectedAttributes,
      });
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 100);
    } catch (e) {}
  };

  return (
    <div className="relative">
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
        cancelBtnLabel={submitted ? "Close" : "Cancel"}
        submitBtnDisabled={submitted}
        title={"Tell us what your source was"}
        open={openModal}
        setOpen={setOpenModal}
        onCancel={() => {
          router.push("..");
        }}
        onSubmit={onSubmit}
      >
        {!submitted ? (
          <div className="overflow-auto min-h-[50vh]">
            <span className="text-red-500">{message}</span>
            <Typography variant="paragraph">
              Please tell us what you were thinking of, so that we can do better
              next time.
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
          </div>
        ) : (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-green-500">
            <CheckBadgeIcon className="h-[20%] w-[20%]" />
            <Typography variant="h6" className="pt-8 ">
              Your answer was successfully submitted.
            </Typography>
            <Typography variant="paragraph" className="pt-8 ">
              For you, <span className="font-bold">{selectedSource.label}</span>{" "}
              can be considered as{" "}
              <span className="font-bold">
                {selectedAttributes.map((source) => source.label).join(", ")}
              </span>
              .
            </Typography>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default wrongSource;
