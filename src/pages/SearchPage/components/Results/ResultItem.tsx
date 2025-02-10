import { TResultItem } from "@/types";

interface IProps {
  item: TResultItem;
}

function ResultItem({ item }: IProps) {
  const { DocumentTitle, DocumentExcerpt, DocumentURI } = item;

  return (
    <div className="flex flex-col gap-4">
      <a
        href={DocumentURI}
        className="text-primary font-semibold text-[22px] leading-[28px] tracking-[0px] hover:underline"
      >
        {DocumentTitle.Text}
      </a>

      <p className="leading-6 tracking-[0.14px]">{DocumentExcerpt.Text}</p>

      <a
        href={DocumentURI}
        className="text-[#686868] text-[14px] leading-[26px] tracking-[0.12px]"
      >
        {DocumentURI}
      </a>
    </div>
  );
}

export default ResultItem;
