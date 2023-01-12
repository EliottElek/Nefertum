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
  const [results, setResults] = useState(null);

  const { sessionId, setSessionId } = useAppContext();
  const [loading, setLoading] = useState(false);

  const answerQuestion = async (answer) => {
    setLoading(true);
    try {
      const { data: questionData } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/answer/${sessionId}`,
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
      setQuestion(questionData.data.question);
      setResults(questionData.data);
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
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/start/${id}`
        );
        setQuestion(data.data);
        console.log(id);
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
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      {loading && <Backdrop />}
      <div className="flex w-[95%] max-w-4xl  flex-col-reverse md:flex-row h-full mt-10 items-center justify-center gap-10 rounded-xl bg-white p-10 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
        {question && question.imageSupport && (
          <img className="max-w-[50%]" src={question.imageSupport} />
        )}
        <Acc sessionId={sessionId} question={question} results={results} />
        <div className="flex-col flex gap-1">
          <Typography variant="paragraph" className="text-gray-50 my-2">
            Question {index + 1}
          </Typography>

          <Typography variant="h5" className="text-gray-50 mt-2">
            {question && question.label}
          </Typography>
          <Typography className="text-gray-50 mb-4 mt-4 hover:underline text-sm">
            <a
              target="_blank"
              href={`https://www.reverso.net/traduction-texte#sl=eng&tl=fra&text=${question?.attribute?.toLowerCase()}`}
            >
              See the translation of {question?.attribute.toLowerCase()} in
              french.
            </a>
          </Typography>
          <div className="flex flex-col gap-1">
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
