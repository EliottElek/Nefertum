import { Fragment } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export default function CustomModal({
  open,
  setOpen,
  title,
  onSubmit,
  onCancel,
  children,
  cancelBtnLabel,
  submitBtnLabel,
}) {
  const handleOpen = () => setOpen(!open);
  return (
    <Fragment>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody divider className="flex-col">
          {children}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="purple"
            onClick={() => {
              handleOpen();
              onCancel();
            }}
            className="mr-1"
          >
            <span>{cancelBtnLabel}</span>
          </Button>
          <Button variant="gradient" color="purple" onClick={onSubmit}>
            <span>{submitBtnLabel}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}
