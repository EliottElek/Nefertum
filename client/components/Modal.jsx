import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import ButtonCustom from "./Button";

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
      <Dialog
        open={open}
        handler={handleOpen}
        className="!max-w-xl w-[90%] max-h-[90%] overflow-auto"
      >
        <DialogHeader>{title}</DialogHeader>
        <DialogBody divider className="flex-col">
          {children}
        </DialogBody>
        <DialogFooter>
          <ButtonCustom
            className="!text-[#cf46ca]"
            disabled={cancelBtnDisabled}
            variant="text"
            onClick={() => {
              handleOpen();
              onCancel();
            }}
            className="mr-1"
          >
            <span>{cancelBtnLabel}</span>
          </ButtonCustom>
          <ButtonCustom disabled={submitBtnDisabled} onClick={onSubmit}>
            <span>{submitBtnLabel}</span>
          </ButtonCustom>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
