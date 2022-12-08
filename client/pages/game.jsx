import React, { useEffect, useState } from "react";
import Backdrop from "../components/Backdrop";
import Button from "../components/Button";
import { ResponsesDisplay } from "../data";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Acc from "../components/Acc";
import { Typography } from "@material-tailwind/react";
import { useAppContext } from "../context";
import Head from "next/head";

const Game = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);

  const { sessionId, setSessionId } = useAppContext();
  const [loading, setLoading] = useState(false);

  const answerQuestion = async (answer) => {
    setLoading(true);
    try {
      const { data: questionData } = await axios.post(
        `http://localhost:5000/answer/${sessionId}`,
        {
          data: {
            question: question,
            answer: answer,
          },
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      setQuestion(questionData.data);
      setLoading(false);
      setIndex((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    const startGame = async () => {
      try {
        const id = uuidv4();
        setSessionId(id);
        const { data } = await axios.get(`http://localhost:5000/start/${id}`);
        setQuestion(data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    if (!sessionId) startGame();
  }, [sessionId, setSessionId, setQuestion, setLoading]);

  return (
    <>
      <Head>
        <title>Nefertum | Play</title>
        <meta
          name="description"
          content="I'm a web developer, who's familiar with all kind of technologies related to web."
        />
      </Head>
      {loading && <Backdrop />}
      <div className="flex max-w-[95%] flex-col-reverse md:flex-row h-full mt-10 items-center justify-center gap-10 rounded-xl bg-white p-10 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
        {question && question.imageSupport && (
          <img className="max-w-[50%]" src={question.imageSupport} />
        )}
        <Acc sessionId={sessionId} question={question} />
        <div className="flex-col flex gap-8">
          <Typography variant="paragraph" className="text-gray-50">
            Question {index + 1}
          </Typography>

          <Typography variant="h5" className="text-gray-50">
            {question && question.label}
          </Typography>
          <div className="flex flex-col gap-4">
            {ResponsesDisplay.map((answer, i) => (
              <Button
                variant="outlined"
                onClick={() => answerQuestion(answer)}
                key={i}
              >
                {answer.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
