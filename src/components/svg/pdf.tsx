export const PdfSvg = () => {
  return (
    <svg
      style={{
        height: "40px",
        width: "40px",
        marginRight: "10px",
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        fill="#ff4444"
        d="M448 464c8.8 0 16-7.2 16-16V160H368c-17.7 0-32-14.3-32-32V48H96c-8.8 0-16 7.2-16 16v384c0 8.8 7.2 16 16 16h352z"
      />

      <path fill="#dd2222" d="M368 128h96L368 32v80c0 8.8 7.2 16 16 16z" />

      <text
        x="130"
        y="320"
        fill="white"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="140"
      >
        PDF
      </text>
    </svg>
  );
};
