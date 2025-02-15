import { MouseEvent } from "react";
import classNames from "classnames";

import CloseIcon from "@/components/icons/CloseIcon";

interface IProps {
  className: string;
  onClearInput: (e: MouseEvent<HTMLButtonElement>) => void;
}

function ClearButton({ className, onClearInput }: IProps) {
  return (
    <button
      onMouseDown={onClearInput}
      className={classNames(className, "cursor-pointer")}
    >
      <CloseIcon />
    </button>
  );
}

export default ClearButton;
