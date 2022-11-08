import Image from "next/image";
import React, { useState } from "react";
import Backdrop from "../components/Backdrop";
import Button from "../components/Button";
import { ResponsesDisplay } from "../data";
const Game = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const answerQuestion = (answer) => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/question`);
        const dataRes = await res.json();
        setQuestion(dataRes.data);
        setLoading(false);
        setIndex((prev) => prev + 1);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }, 400);
  };

  const startGame = async () => {
    try {
      const res = await fetch(`http://localhost:5000/question`);
      const dataRes = await res.json();
      setQuestion(dataRes.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  if (!question) return <Button onClick={startGame}>Start Game</Button>;
  return (
    <div className="flex items-center justify-center gap-10">
      {question && question.imageSupport && (
        <img className="max-w-[50%]" src={question.imageSupport} />
      )}
      <div className="flex-col flex gap-8">
        {loading && <Backdrop />}
        <h4 className="text-slate-500">Question {index + 1}</h4>
        <h1>{question && question.label}</h1>
        <div className="flex flex-col gap-4">
          {ResponsesDisplay.map((answer, i) => (
            <Button onClick={() => answerQuestion(answer)} key={i}>
              {answer.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
