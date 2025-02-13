import classNames from "classnames";

import { TTextSegment } from "@/types";

interface IProps {
  textSegments: TTextSegment[];
}

function HighlightText({ textSegments }: IProps) {
  return (
    <>
      {textSegments.map(({ text, shouldHighlight }, index) => (
        <span
          key={index}
          className={classNames(shouldHighlight ? "font-bold" : "")}
        >
          {text}
        </span>
      ))}
    </>
  );
}

export default HighlightText;
