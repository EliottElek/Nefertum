import { Fragment, useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  ListItem,
  List,
} from "@material-tailwind/react";
import { supabase } from "../lib/supabase";
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

      console.log(data.data);
      setContextAnswer(data.data);
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

  const onGoodResult = async (index) => {
    try {
      await supabase.from("games2").insert({
        won: true,
        top_five: index <= 4 ? true : false,
      });
    } catch (e) {
      console.log(e);
    }
    router.push("/feedback");
  };
  const onBadResult = async () => {
    try {
      await supabase.from("games2").insert({
        won: false,
      });
    } catch (e) {
      console.log(e);
    }
    router.push("/add-source");
  };
  return (
    <div className="self-start !text-gray-50 m-auto w-full flex-1 flex flex-col">
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
            Best 10 results
          </AccordionHeader>
          <AccordionBody className="text-gray-50 h-[160px] overflow-auto pr-5">
            {!results ? (
              "No results yet for this session."
            ) : (
              <ul>
                {results?.sources?.map((result, i) => (
                  <li key={i}>{result.label}</li>
                ))}
              </ul>
            )}
          </AccordionBody>
        </Accordion>
      </Fragment>
      <CustomModal
        submitBtnLabel={"My source is not present in the list"}
        title={"We might have a result..."}
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={onBadResult}
      >
        <div className="flex flex-col items-start">
          From our calculations, you smell would be...
          <Typography variant="h4" className="pt-5 text-gray-700">
            {results?.sources[0]?.label}
          </Typography>
          <a
            target="_blank"
            className="!font-sans hover:underline text-sm"
            href={`https://www.reverso.net/traduction-texte#sl=eng&tl=fra&text=${results?.sources[0]?.label?.toLowerCase()}`}
          >
            See the translation of {results?.sources[0]?.label} in french.
          </a>
          <h3>Is you smell in the list ? Pleave click on it if yes.</h3>
          {results?.sources && (
            <List className="w-full">
              {results?.sources.map((s, i) => (
                <ListItem
                  className="group text-sm py-1.5 px-3 font-normal text-gray-500 bg-gray-100 bg-opacity-75 hover:bg-[#cf46ca] hover:text-white focus:bg-[#cf46ca] focus:text-white"
                  key={i}
                  onClick={() => onGoodResult(i)}
                >
                  {s.label}
                </ListItem>
              ))}
            </List>
          )}
          {!contextAnswer && (
            <button
              onClick={handleMakeContextRequest}
              className="mt-10 text-sm hover:underline"
            >
              Why this result ?{" "}
            </button>
          )}
          {contextAnswer && contextAnswer?.texts?.length > 0 ? (
            <div>
              {contextAnswer?.texts.map((answer, i) => (
                <div
                  key={i}
                  className="flex mt-4 flex-col !font-bold !font-sans"
                >
                  {answer?.title?.value}, {answer?.author?.value},{" "}
                  {answer?.date?.value}
                  <div
                    className="italic !font-normal !font-sans"
                    dangerouslySetInnerHTML={{
                      __html: renderBoldStrings(answer?.text.value, [
                        results?.sources[0]?.label,
                        ...contextAnswer?.attributes.map((a) => a.attribute),
                      ]),
                    }}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            !contextAnswer && <p>We could not provide you with more context.</p>
          )}
        </div>
      </CustomModal>
    </div>
  );
}
