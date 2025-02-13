import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

function ResultsWrapper({ children }: IProps) {
  return <div className="px-8 md:px-40 pt-10">{children}</div>;
}

export default ResultsWrapper;
