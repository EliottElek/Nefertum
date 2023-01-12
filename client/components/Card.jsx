import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import ButtonCustom from "./Button";

export const FeedBackCard = () => {
  return (
    <Card className="bg-opacity-75">
      <CardBody className="text-center">
        <Typography variant="h5" className="mb-2">
          Give us feedback
        </Typography>
        <Typography>
          Seu non suasisse. Virus et precor dedere, sed intemptata vulneris
          solet flebile exclamat socia, pede miserere: matre lenis. Et demisere
          ingenti.
        </Typography>
      </CardBody>
      <CardFooter divider className="flex items-center justify-center py-3">
        <Link href="/feedback">
          <ButtonCustom className="w-full">Fill the form</ButtonCustom>
        </Link>
      </CardFooter>
    </Card>
  );
};
export const AddSourceCard = () => {
  return (
    <Card className="bg-opacity-75">
      <CardBody className="text-center">
        <Typography variant="h5" className="mb-2">
          Add a source
        </Typography>
        <Typography>
          Seu non suasisse. Virus et precor dedere, sed intemptata vulneris
          solet flebile exclamat socia, pede miserere: matre lenis. Et demisere
          ingenti.
        </Typography>
      </CardBody>
      <CardFooter divider className="flex items-center justify-center py-3">
        <Link href="/add-source">
          <ButtonCustom className="w-full">Add a source</ButtonCustom>
        </Link>
      </CardFooter>
    </Card>
  );
};
export const NewGameCard = () => {
  return (
    <Card className="bg-opacity-75">
      {/* <CardHeader
        color="purple"
        className="relative h-32 translate-y-0 m-0 rounded-b-none"
      ></CardHeader> */}
      <CardBody className="text-center">
        <Typography variant="h5" className="mb-2">
          New game
        </Typography>
        <Typography>
          Seu non suasisse. Virus et precor dedere, sed intemptata vulneris
          solet flebile exclamat socia, pede miserere: matre lenis. Et demisere
          ingenti.
        </Typography>
      </CardBody>
      <CardFooter divider className="flex items-center justify-center py-3">
        <Link href="/game">
          <ButtonCustom className="w-full">Start a game</ButtonCustom>
        </Link>
      </CardFooter>
    </Card>
  );
};
