import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = "",
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className={`skeleton-block skeleton-shimmer ${className}`.trim()}
        />
      ))}
    </>
  );
};

export default LoadingSkeleton;
