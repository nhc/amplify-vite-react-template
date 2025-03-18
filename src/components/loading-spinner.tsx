export const LoadingSpinner = () => {
  return (
    <div className="relative w-12 h-12">
      <svg
        className="animate-spin"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="stroke-gray-200"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="stroke-blue-600"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
