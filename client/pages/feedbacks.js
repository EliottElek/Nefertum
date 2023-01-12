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
      <div className="flex max-w-[95%] overflow-auto text-gray-50 max-h-[80vh] flex-col md:max-w-5xl h-full mt-10 items-center justify-center gap-10 rounded-xl bg-white p-10 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
        <Typography variant="h3">Users feedbacks</Typography>
        {feedbacks?.length === 0 ? (
          <p>No feedback for the moment.</p>
        ) : (
          <ul>
            {feedbacks?.map((feedback) => (
              <li>
                {feedback.name ? feedback.name : "Unknown"} - {feedback.comment}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
