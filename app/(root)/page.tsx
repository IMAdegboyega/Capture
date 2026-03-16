"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState, Pagination, SharedHeader, VideoCard } from "@/components";
import { getAllVideos } from "@/lib/api/videos";
import { AnimatePresence, motion } from "framer-motion";
import VideoGridSkeleton from "@/components/VideoGridSkeleton";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

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

  return (
    <main className="wrapper page">
      <SharedHeader subHeader="Public Library" title="All Videos" />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <VideoGridSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {videos?.length > 0 ? (
              <motion.section
                className="video-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {videos.map(({ video, user }) => (
                  <motion.div key={video.id} variants={itemVariants}>
                    <VideoCard
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
                  </motion.div>
                ))}
              </motion.section>
            ) : (
              <EmptyState
                icon="/assets/icons/video.svg"
                title="No Videos Found"
                description="Try adjusting your search."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
