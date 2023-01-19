import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
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
        {feedbacks?.length === 0 ? (
          <p>No feedback for the moment.</p>
        ) : (
          <ul>
            {feedbacks?.map((feedback) => (
              <li className="flex gap-2 mt-4">
                <span className="text-purple-400">
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
