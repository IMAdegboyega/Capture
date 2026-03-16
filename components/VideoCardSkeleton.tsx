const VideoCardSkeleton = () => (
  <div className="video-card animate-pulse">
    {/* Thumbnail */}
    <div className="thumbnail bg-gray-200 dark:bg-gray-700 rounded-t-2xl h-[190px]" />

    <article>
      <div>
        {/* Avatar + username row */}
        <figure className="flex items-center gap-1.5">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 size-[34px] shrink-0" />
          <figcaption className="flex flex-col gap-1">
            <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-2 w-12 rounded bg-gray-100 dark:bg-gray-600" />
          </figcaption>
        </figure>
        {/* Views */}
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2.5 w-6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      {/* Title line */}
      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
    </article>
  </div>
);

export default VideoCardSkeleton;
