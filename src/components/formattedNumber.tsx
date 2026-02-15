function FormattedNumber({value}: { value: number }) {             // AI usage here
  const [intPart, decPart] = Number(value)
    .toFixed(2)
    .split(".");

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <span className={"font-robotoMono font-normal text-[16px]"}>
      {formattedInt}
      {decPart && (
        <span className={"text-[#999999]"}>,{decPart}</span>
      )}
    </span>
  );
}

export default FormattedNumber