import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Card Skeleton */}
          <div className="h-[286px] rounded-[24px] bg-neutral-800/70 border border-neutral-700/50 p-8 flex items-center justify-between" />

          {/* 4 Metrics Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[118px] rounded-2xl bg-neutral-800/70 border border-neutral-700/50 p-5"
              />
            ))}
          </div>

          {/* Daily Forecast Skeleton */}
          <div className="mt-4">
            <div className="h-6 w-36 bg-neutral-800/80 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="h-[165px] rounded-2xl bg-neutral-800/70 border border-neutral-700/50"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-4">
          <div className="h-[693px] rounded-[24px] bg-neutral-800/70 border border-neutral-700/50 p-6 flex flex-col gap-4">
            <div className="h-6 w-40 bg-neutral-700/60 rounded mb-2" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-[60px] rounded-xl bg-neutral-700/40"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
