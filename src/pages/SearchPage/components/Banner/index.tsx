import LogoIcon from "@/components/icons/LogoIcon";

function Banner() {
  return (
    <div className="bg-[#F0F0F0] px-40 py-2">
      <div className="flex items-center gap-2">
        <LogoIcon />
        <div className="text-[9.89px] leading-[12.43px] tracking-[0.5px]">
          An Official Website of the{" "}
          <span className="font-semibold tracking-[0.39px]">
            Singapore Government
          </span>
        </div>
      </div>
    </div>
  );
}

export default Banner;
