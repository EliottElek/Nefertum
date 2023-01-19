import { Fragment, useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import CustomModal from "./Modal";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { renderBoldStrings } from "../lib/boldString";
export default function Acc({ sessionId, question, results }) {
  const [open, setOpen] = useState(0);
  const [contextAnswer, setContextAnswer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  const [answers, setAnswers] = useState(null);

  const parentRef = useRef();

  const handleMakeContextRequest = async () => {
    if (!results) return;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/answer_justifier/${sessionId}`,
        { data: results?.sources[0] }
      );
      console.log(data);
      setContextAnswer(data.data.data);
    } catch (err) {
      toast.error("An error occured.");
    }
  };
  useEffect(() => {
    const loadAnswers = async () => {
      try {
        const { data: answ } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/answers/${sessionId}`
        );
        setAnswers(answ.data.answers);
      } catch (err) {}
    };
    if (sessionId && question) loadAnswers();
  }, [setAnswers, sessionId, question]);

  useEffect(() => {
    if (results?.result === true) {
      setOpenModal(true);
    }
  }, [results?.result, setOpen]);
  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, [parentRef]);

  return (
    <div className="self-start !text-gray-50 pr-5 max-w-xl m-auto w-full">
      <Fragment>
        <Accordion
          animate={customAnimation}
          className="text-gray-50"
          open={open === 1}
        >
          <AccordionHeader
            className="text-gray-50 hover:text-gray-200"
            onClick={() => handleOpen(1)}
          >
            Your previous answers {answers && `(${answers?.length})`}
          </AccordionHeader>
          <AccordionBody className="text-gray-50 h-[160px] overflow-auto pr-5">
            {!answers ? (
              "No answers yet for this session."
            ) : (
              <ul>
                {answers &&
                  answers.map((answer, i) => (
                    <li className="list_item" key={i}>
                      {answer.question.label} - {answer.answer.label}
                    </li>
                  ))}
              </ul>
            )}
          </AccordionBody>
        </Accordion>

        <Accordion open={open === 2} animate={customAnimation}>
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="text-gray-50 hover:text-gray-200"
          >
            Filtered results {results && `(${results.length})`}
          </AccordionHeader>
          <AccordionBody className="text-gray-50 h-[160px] overflow-auto pr-5">
            {!results ? (
              "No results yet for this session."
            ) : (
              <ul>
                {results?.sources?.map((result, i) => (
                  <li key={i}>{result.label}</li>
                ))}
                <li>
                  + {results.length - results?.sources.length} more results
                </li>
              </ul>
            )}
          </AccordionBody>
        </Accordion>
      </Fragment>
      <CustomModal
        submitBtnLabel={"Yes it is !"}
        cancelBtnLabel={"No it's not..."}
        title={"We might have a result..."}
        open={openModal}
        setOpen={setOpenModal}
        onCancel={() => {
          router.push("/add-source");
        }}
        onSubmit={() => {}}
      >
        <div>
          From our calculations, you smell would be...
          <Typography variant="h6" className="pt-5">
            {/* <ul>
            {results?.sources?.map((result, i) => (
              <li>
                <li key={i}>{result.label}</li>
              </li>
            ))}
          </ul> */}
            {results?.sources[0]?.label}
          </Typography>
          {!contextAnswer && (
            <button
              onClick={handleMakeContextRequest}
              className="mt-10 text-sm hover:underline"
            >
              Why this result ?{" "}
            </button>
          )}
          {contextAnswer && contextAnswer.length > 0 ? (
            <div>
              {contextAnswer?.map((answer) => (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderBoldStrings(answer?.value, [
                      results?.sources[0]?.label,
                    ]),
                  }}
                ></div>
              ))}
            </div>
          ) : (
            contextAnswer && <p>We could not provide you with more context.</p>
          )}
        </div>
      </CustomModal>
    </div>
  );
}
