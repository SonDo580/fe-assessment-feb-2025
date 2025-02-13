import classNames from "classnames";

import CloseIcon from "@/components/icons/CloseIcon";

interface IProps {
  className: string;
  onClick: () => void;
}

function ClearButton({ className, onClick }: IProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(className, "cursor-pointer")}
    >
      <CloseIcon />
    </button>
  );
}

export default ClearButton;
