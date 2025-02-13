import classNames from "classnames";
import { ReactNode } from "react";

interface IProps {
  className: string;
  children: ReactNode;
  noData?: boolean;
}

function SuggestionsWrapper({ className, children, noData = true }: IProps) {
  return (
    <div
      className={classNames(
        className,
        "rounded-b-md shadow-common bg-white",
        noData && "p-4"
      )}
    >
      {children}
    </div>
  );
}

export default SuggestionsWrapper;
