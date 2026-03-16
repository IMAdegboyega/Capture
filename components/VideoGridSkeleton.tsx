import VideoCardSkeleton from "./VideoCardSkeleton";

const VideoGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <section className="video-grid">
    {Array.from({ length: count }).map((_, i) => (
      <VideoCardSkeleton key={i} />
    ))}
  </section>
);

export default VideoGridSkeleton;
