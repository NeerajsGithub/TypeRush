"use client"

import { useState } from "react";

const CopyToClipboard = ({ gameID }: { gameID: string }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = async () => {
    const copyText = gameID;
  
    try {
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
  
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
  };
  

  return (
    <div className="w-full  max-w-[16rem]">
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute px-4 py-3 end-2.5 top-1/2 -translate-y-1/2 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-600 dark:hover:bg-gray-700 rounded-xl py-2 px-2.5 inline-flex items-center justify-center bg-white border-2 border-gray-200 border"
        >
          <span className="inline-flex items-center" id="default-message">
            <svg
              className={`${isCopied ? 'hidden' : ''} w-3 h-3 me-1.5`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
            <span className={` ${isCopied ? 'hidden' : ''} text-xs font-semibold`}>Copy</span>
          </span>
          <span className={`inline-flex items-center ${isCopied ? '' : 'hidden'}`} id="success-message">
            <svg
              className="w-3 h-3 text-blue-700 dark:text-blue-500 me-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
            <span className={`${isCopied ? '' : 'hidden'} text-xs font-semibold`}>Copied</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CopyToClipboard;
