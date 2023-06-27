import React, { useEffect, useState } from "react";
import Backdrop from "../../components/Backdrop";
import { Button } from "@material-tailwind/react";
import { ResponsesDisplay } from "../../data";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Acc from "../../components/v2/Acc";
import { Typography } from "@material-tailwind/react";
import { useAppContext } from "../../context";
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
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/answerEmb/${sessionId}`,
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
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/startEmb/${id}`
        );
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
        <title>Nefertum | Play (embedding version)</title>
        <meta name="description" content="Nefertum, akinator for smells." />
      </Head>
      {loading && <Backdrop />}
      <div className="flex w-[95%] max-w-[700px] pt-4 flex-col-reverse gap-10 rounded-xl">
        {question && question.imageSupport && (
          <img className="max-w-[50%]" src={question?.imageSupport} />
        )}
        <Acc sessionId={sessionId} question={question} results={results} />
        <div className="flex-col flex gap-1">
          {!question ? (
            questionSkeleton()
          ) : (
            <Typography variant="paragraph" className="text-gray-50 my-2">
              Question {index + 1}
            </Typography>
          )}

          {!question ? (
            titleSkeleton()
          ) : (
            <Typography variant="h3" className="text-gray-50">
              {question?.label}
            </Typography>
          )}

          <Typography className="text-gray-50 mb-4 mt-4 hover:underline text-sm">
            <a
              target="_blank"
              href={`https://www.reverso.net/traduction-texte#sl=eng&tl=fra&text=${question?.attribute?.toLowerCase()}`}
            >
              See the translation of {question?.attribute?.toLowerCase()} in
              french.
            </a>
          </Typography>
          <div className="flex flex-col gap-1 p-4">
            {ResponsesDisplay.map((answer, i) => (
              <Button
                className="py-4"
                color="white"
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

const titleSkeleton = () => (
  <div role="status" className="w-full animate-pulse">
    <div className="flex items-center pt-4 w-full group transition-all delay-75 relative rounded-md gap-1">
      <div className="h-8 bg-gray-400 rounded-full w-full"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);
const questionSkeleton = () => (
  <div role="status" className="w-full animate-pulse">
    <div className="flex items-center pt-4 w-full group transition-all delay-75 relative rounded-md gap-1">
      <div className="h-3 bg-gray-400 rounded-full w-[30%]"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);
export default Game;
