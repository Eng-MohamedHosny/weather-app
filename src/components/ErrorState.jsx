import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4 max-w-md mx-auto my-auto">
      <div className="mb-6 flex items-center justify-center">
        <img
          src="/assets/images/icon-error.svg"
          alt="Error"
          className="w-10 h-10 opacity-90"
        />
      </div>

      <h3 className="text-3xl font-bold font-heading text-neutral-0 mb-3 tracking-tight">
        Something went wrong
      </h3>
      <p className="text-neutral-200 text-sm sm:text-base mb-6 max-w-sm leading-relaxed">
        {message || "We couldn't connect to the server (API error). Please try again in a few moments."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl border border-neutral-700 shadow-card transition-all focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
        >
          <img src="/assets/images/icon-retry.svg" alt="" className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
