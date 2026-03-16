"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { EmptyState, SharedHeader, VideoCard } from "@/components";
import { getAllVideosByUser } from "@/lib/api/videos";
import { AnimatePresence, motion } from "framer-motion";
import VideoGridSkeleton from "@/components/VideoGridSkeleton";

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

const ProfilePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = params.id as string;
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || undefined;

  const [userData, setUserData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllVideosByUser(userId, query, filter);
        if (!data.user) {
          router.push("/404");
          return;
        }
        setUserData(data.user);
        setVideos(data.videos);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, query, filter, router]);

  return (
    <main className="wrapper page">
      <AnimatePresence mode="wait">
        {isLoading || !userData ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <VideoGridSkeleton count={6} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SharedHeader
              subHeader={userData.email}
              title={userData.name}
              userImg={userData.image ?? ""}
            />

            {videos?.length > 0 ? (
              <motion.section
                className="video-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {videos.map(({ video }: any) => (
                  <motion.div key={video.id} variants={itemVariants}>
                    <VideoCard
                      id={video.video_id}
                      title={video.title}
                      thumbnail={video.thumbnail_url}
                      createdAt={new Date(video.created_at)}
                      userImg={userData.image ?? ""}
                      username={userData.name ?? "Guest"}
                      views={video.views}
                      visibility={video.visibility}
                      duration={video.duration}
                    />
                  </motion.div>
                ))}
              </motion.section>
            ) : (
              <EmptyState
                icon="/assets/icons/video.svg"
                title="No Videos Available Yet"
                description="Video will show up here once you upload them."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProfilePage;
