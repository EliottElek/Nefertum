import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Spinner } from "flowbite-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import Head from "next/head";
const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const { data: fdbs } = await supabase
          .from("feedback")
          .select("name, id, comment");
        setFeedbacks(fdbs);
      } catch (e) {
        toast.error("An error occured loading the feedbacks.");
      }
    };
    loadFeedbacks();
  }, [setFeedbacks]);
  return (
    <div>
      <Head>
        <title>Nefertum | Feedbacks</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      <div className="flex max-w-[95%] overflow-auto text-gray-50 flex-col md:max-w-5xl h-full mt-10  gap-10">
        <Typography variant="h2">Users feedbacks</Typography>
        {!feedbacks && (
          <div className="flex items-center gap-3">
            <p>Loading feedbacks...</p>
            <Spinner size="md" color="purple" />
          </div>
        )}
        {feedbacks?.length === 0 ? (
          <p>No feedback for the moment.</p>
        ) : (
          <ul>
            {feedbacks?.map((feedback) => (
              <li className="flex flex-col gap-2 mt-4">
                <span className="text-[#CF46CA]">
                  {feedback.name ? feedback.name : "Unknown"}
                </span>{" "}
                {feedback.comment}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
