"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState, Pagination, SharedHeader, VideoCard } from "@/components";
import { getAllVideos } from "@/lib/api/videos";

interface VideoData {
  video: {
    id: string;
    video_id: string;
    title: string;
    thumbnail_url: string;
    created_at: string;
    views: number;
    visibility: string;
    duration: number | null;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_videos: number;
  page_size: number;
}

const HomePageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || undefined;
  const page = Number(searchParams.get("page")) || 1;

  const [videos, setVideos] = useState<VideoData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const data = await getAllVideos(query, filter, page);
        setVideos(data.videos);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [query, filter, page]);

  if (isLoading) {
    return (
      <main className="wrapper page">
        <SharedHeader subHeader="Public Library" title="All Videos" />
        <p>Loading videos...</p>
      </main>
    );
  }

  return (
    <main className="wrapper page">
      <SharedHeader subHeader="Public Library" title="All Videos" />

      {videos?.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video, user }) => (
            <VideoCard
              key={video.id}
              id={video.video_id}
              title={video.title}
              thumbnail={video.thumbnail_url}
              createdAt={new Date(video.created_at)}
              userImg={user?.image ?? ""}
              username={user?.name ?? "Guest"}
              views={video.views}
              visibility={video.visibility as Visibility}
              duration={video.duration}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon="/assets/icons/video.svg"
          title="No Videos Found"
          description="Try adjusting your search."
        />
      )}

      {pagination && pagination.total_pages > 1 && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          queryString={query}
          filterString={filter}
        />
      )}
    </main>
  );
};

const HomePage = () => (
  <Suspense>
    <HomePageContent />
  </Suspense>
);

export default HomePage;
