"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VideoDetailHeader, VideoInfo, VideoPlayer } from "@/components";
import { getVideoById, getTranscript } from "@/lib/api/videos";

const VideoPage = () => {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;

  const [videoData, setVideoData] = useState<{
    video: any;
    user: any;
  } | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoResult, transcriptResult] = await Promise.all([
          getVideoById(videoId),
          getTranscript(videoId),
        ]);

        if (!videoResult.video) {
          router.push("/404");
          return;
        }

        setVideoData(videoResult);
        setTranscript(transcriptResult);
      } catch (error) {
        console.error("Failed to fetch video:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId, router]);

  if (isLoading || !videoData) {
    return (
      <main className="wrapper page">
        {/* Header skeleton */}
        <div className="animate-pulse flex flex-col gap-2.5">
          <div className="h-8 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-48 rounded bg-gray-100 dark:bg-gray-600" />
        </div>

        {/* Video + sidebar skeleton */}
        <section className="video-details">
          <div className="content">
            {/* 16/9 video placeholder */}
            <div className="animate-pulse aspect-video w-full rounded-2xl bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="animate-pulse flex flex-col gap-4 lg:max-w-[350px] xl:max-w-[410px] w-full">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-4/6 rounded bg-gray-100 dark:bg-gray-600" />
          </div>
        </section>
      </main>
    );
  }

  const { video, user } = videoData;

  return (
    <main className="wrapper page">
      <VideoDetailHeader
        title={video.title}
        createdAt={new Date(video.created_at)}
        userImg={user?.image}
        username={user?.name}
        videoId={video.video_id}
        ownerId={video.user_id}
        visibility={video.visibility}
        thumbnailUrl={video.thumbnail_url}
      />

      <section className="video-details">
        <div className="content">
          <VideoPlayer videoId={video.video_id} />
        </div>

        <VideoInfo
          transcript={transcript}
          title={video.title}
          createdAt={new Date(video.created_at)}
          description={video.description}
          videoId={videoId}
          videoUrl={video.video_url}
        />
      </section>
    </main>
  );
};

export default VideoPage;
