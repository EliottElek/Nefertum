import React, { useState } from "react";
import Button from "../components/Button";
import { questions, ResponsesDisplay } from "../data";
const Game = () => {
  const [index, setIndex] = useState(0);
  const [source, setSource] = useState(null);
  const [answers, setAnswers] = useState([]);

  const answerQuestion = (answer) => {
    setAnswers((prev) => [...prev, answer]);

    if (index === questions.length - 1) {
      setSource("Tulipe");
      setAnswers([]);
    } else {
      setIndex((prev) => prev + 1);
    }
  };
  const resetGame = () => {
    setIndex(0);
    setSource(null);
  };
  return (
    <div className="flex-col flex gap-8">
      {!source ? (
        <>
          <h4 className="text-slate-500">Question {index + 1}</h4>
          <h1>{questions[index].label}</h1>
          <div className="flex flex-col gap-4">
            {ResponsesDisplay.map((answer, i) => (
              <Button onClick={() => answerQuestion(answer)} key={i}>
                {answer.label}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <h1>Est-ce votre source est : {source} ?</h1>
          <div className="flex flex-col gap-4">
            <Button onClick={resetGame}>Oui</Button>
            <Button onClick={resetGame}>Non</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
