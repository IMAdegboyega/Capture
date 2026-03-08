"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { EmptyState, SharedHeader, VideoCard } from "@/components";
import { getAllVideosByUser } from "@/lib/api/videos";

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

  if (isLoading || !userData) {
    return (
      <main className="wrapper page">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="wrapper page">
      <SharedHeader
        subHeader={userData.email}
        title={userData.name}
        userImg={userData.image ?? ""}
      />

      {videos?.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video }: any) => (
            <VideoCard
              key={video.id}
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
          ))}
        </section>
      ) : (
        <EmptyState
          icon="/assets/icons/video.svg"
          title="No Videos Available Yet"
          description="Video will show up here once you upload them."
        />
      )}
    </main>
  );
};

export default ProfilePage;
