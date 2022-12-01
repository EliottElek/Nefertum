import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import axios from "axios";

export default function AccordionComponent({ sessionId, question }) {
  const [open, setOpen] = useState(1);
  const [answers, setAnswers] = useState(null);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  useEffect(() => {
    const loadAnswers = async () => {
      try {
        const { data: answ } = await axios.get(
          `http://localhost:5000/answers/${sessionId}`
        );
        setAnswers(answ.data.answers);
      } catch (err) {}
    };
    if (sessionId && question) loadAnswers();
  }, [setAnswers, sessionId, question]);
  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };
  return (
    <div className="flex self-start  flex-col max-w-sm  h-full overflow-auto">
      <Accordion open={open === 1} className="h-full" animate={customAnimation}>
        <AccordionHeader
          className="text-gray-50 hover:text-gray-200"
          onClick={() => handleOpen(1)}
        >
          See your previous answers
        </AccordionHeader>
        <AccordionBody className="text-gray-50 max-h-none min-h-[300px] max-h-full overflow-auto pr-5">
          {!answers ? (
            "No answers yet for this session."
          ) : (
            <ul>
              {answers &&
                answers.map((answer, i) => (
                  <li className = "list_item" key={i}>
                    {answer.question.label} - {answer.answer.label}
                  </li>
                ))}
            </ul>
          )}
        </AccordionBody>
      </Accordion>
    </div>
  );
}
