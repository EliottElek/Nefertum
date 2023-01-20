import React, { useEffect, useState } from "react";
import CustomModal from "../components/Modal";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { toast, Toaster } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import axios from "axios";
const ClearMatrixes = () => {
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
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/clear-matrixes`);
      setLoading(false);
      toast.success("All matrixes were successfully deleted.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (e) {
      toast.error("An error occured deleting matrixes.");
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <Head>
        <title>Nefertum | Clear matrixes</title>
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
            "Clear all matrixes"
          )
        }
        cancelBtnLabel={"Cancel"}
        title={"Clear matrixes"}
        open={openModal}
        setOpen={setOpenModal}
        onCancel={() => {
          router.push("..");
        }}
        onSubmit={onSubmit}
      >
        <div className="overflow-auto">
          <p className="!font-sans">
            Are you sure you want to clear all matrixes ?{" "}
          </p>
          <strong>All sessions will be lost.</strong>
        </div>
        <Toaster />
      </CustomModal>
    </div>
  );
};

export default ClearMatrixes;
