import React, { useEffect, useState } from "react";
import CustomModal from "../components/Modal";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { toast, Toaster } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
const wrongSource = () => {
  const [openModal, setOpenModal] = useState(true);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  // selected attributes
  const router = useRouter();

  useEffect(() => {
    if (openModal === false) router.push("..");
  }, [openModal, router]);

  const onSubmit = async () => {
    setLoading(true);
    if (comment === "") {
      setMessage("You must selected a source.");
      setLoading(false);
      return;
    }
    try {
      const { data: source } = await supabase
        .from("feedback")
        .insert({ comment: comment, name: name });

      setLoading(false);
      toast.success("Your feedback was successfully submitted.");
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
        <title>Nefertum | Give feedback</title>
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
            "Submit your feedback"
          )
        }
        cancelBtnLabel={"Cancel"}
        title={"Give us feedback"}
        open={openModal}
        setOpen={setOpenModal}
        onCancel={() => {
          router.push("..");
        }}
        onSubmit={onSubmit}
      >
        <div className="overflow-auto min-h-[50vh]">
          <span className="text-red-500">{message}</span>
          <Typography variant="paragraph">
            Use this form to give us feedback (a bug, design, ux...)
          </Typography>
          <div className="mt-4 flex flex-col">
            <label>Name</label>
            <input
              className="w-full focus:outline-none border border-gray-300 rounded p-2 px-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Who's giving feedback..."
            />
          </div>
          <div className="mt-4 flex-grow flex-1 flex flex-col">
            <label>Name</label>
            <textarea
              className="w-full min-h-[200px] focus:!outline-none border flex-grow flex flex-1 border-gray-300 rounded p-2 px-2 text-sm"
              value={comment}
              placeholder="You message..."
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <Toaster />
      </CustomModal>
    </div>
  );
};

export default wrongSource;
