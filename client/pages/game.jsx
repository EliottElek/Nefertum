import React, { useEffect, useState } from "react";
import Backdrop from "../components/Backdrop";
import Button from "../components/Button";
import { ResponsesDisplay } from "../data";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Game = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const answerQuestion = (answer) => {
    setLoading(true);
    setTimeout(async () => {
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
    }, 400);
  };
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);
  useEffect(() => {
    const startGame = async () => {
      try {
        setSessionId(uuidv4());
        const { data } = await axios.get(`http://localhost:5000/start`);
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
      {loading && <Backdrop />}
      <div className="flex h-full mt-10 items-center justify-center gap-10 rounded-xl bg-white p-10 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
        {question && question.imageSupport && (
          <img className="max-w-[50%]" src={question.imageSupport} />
        )}
        <div className="flex-col flex gap-8">
          <h4 className="text-slate-300">Question {index + 1}</h4>
          <h1 className="text-slate-100">{question && question.label}</h1>
          <div className="flex flex-col gap-4">
            {ResponsesDisplay.map((answer, i) => (
              <Button onClick={() => answerQuestion(answer)} key={i}>
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
