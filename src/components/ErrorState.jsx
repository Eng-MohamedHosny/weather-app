import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-6 shadow-card">
        <img
          src="/assets/images/icon-error.svg"
          alt="Error"
          className="w-8 h-8"
        />
      </div>

      <h3 className="text-2xl font-bold font-heading text-neutral-0 mb-3">
        Something went wrong
      </h3>
      <p className="text-neutral-300 text-base mb-8 max-w-sm leading-relaxed">
        {message || "We couldn't retrieve the weather data. Please check your connection and try again."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2.5 bg-brand-blue hover:bg-brand-blueHover text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-card focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          <img src="/assets/images/icon-retry.svg" alt="" className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
