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
  cancelBtnDisabled,
  submitBtnDisabled,
}) {
  const handleOpen = () => setOpen(!open);
  return (
    <div className="!max-w-xl w-[90%]">
      <Dialog open={open} handler={handleOpen} className="!max-w-xl w-[90%] max-h-[90%] overflow-auto">
        <DialogHeader>{title}</DialogHeader>
        <DialogBody divider className="flex-col">
          {children}
        </DialogBody>
        <DialogFooter>
          <Button
            disabled={cancelBtnDisabled}
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
          <Button
            disabled={submitBtnDisabled}
            variant="gradient"
            color="purple"
            onClick={onSubmit}
          >
            <span>{submitBtnLabel}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
