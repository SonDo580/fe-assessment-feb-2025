import CloseIcon from "@/components/icons/CloseIcon";

interface IProps {
  className: string;
}

function ClearButton({ className }: IProps) {
  return (
    <button className={className}>
      <CloseIcon />
    </button>
  );
}

export default ClearButton;
