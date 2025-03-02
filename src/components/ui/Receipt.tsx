import React from "react";

const Receipt = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 2L7 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2l-2-2H9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 10h6M9 14h6"
      />
    </svg>
  );
};

export default Receipt;