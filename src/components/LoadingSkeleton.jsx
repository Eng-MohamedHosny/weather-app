import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Main Card Loading */}
          <div className="h-[286px] rounded-[20px] md:rounded-[24px] bg-neutral-800 border border-neutral-700/60 shadow-card flex flex-col items-center justify-center text-center p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-neutral-300 text-sm font-medium">Loading...</span>
          </div>

          {/* 4 Metrics with Dashes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {['Feels Like', 'Humidity', 'Wind', 'Precipitation'].map((label) => (
              <div
                key={label}
                className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700/60 shadow-card flex flex-col justify-between min-h-[118px]"
              >
                <span className="text-neutral-300 text-sm font-medium">{label}</span>
                <span className="text-3xl font-bold text-neutral-300 mt-3">—</span>
              </div>
            ))}
          </div>

          {/* Daily Forecast Placeholders */}
          <div className="mt-8">
            <h3 className="text-xl font-bold font-heading text-neutral-0 mb-4">
              Daily forecast
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="h-[165px] rounded-2xl bg-neutral-800 border border-neutral-700/60 shadow-card"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Hourly Skeleton) */}
        <div className="lg:col-span-4">
          <div className="bg-neutral-800 rounded-[20px] md:rounded-[24px] p-5 sm:p-6 border border-neutral-700/60 shadow-card flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-heading text-neutral-0">
                Hourly forecast
              </h3>
              <div className="flex items-center gap-2 bg-neutral-700/60 text-neutral-300 text-sm font-medium px-3.5 py-2 rounded-xl border border-neutral-600/40">
                <span>—</span>
                <img src="/assets/images/icon-dropdown.svg" alt="" className="w-3 h-3 opacity-60" />
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-[60px] rounded-xl bg-neutral-700/40 border border-neutral-700/20"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
