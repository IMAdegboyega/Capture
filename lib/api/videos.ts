import { apiFetch } from "./client";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CloudinaryUploadParams {
  upload_url: string;
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder: string;
  resource_type?: string;
  auto_transcription?: string;
}

interface VideoData {
  id: string;
  video_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  visibility: string;
  user_id: string;
  views: number;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

interface UserBrief {
  id: string;
  name: string | null;
  image: string | null;
}

interface VideoWithUser {
  video: VideoData;
  user: UserBrief | null;
}

interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_videos: number;
  page_size: number;
}

interface VideoListResponse {
  videos: VideoWithUser[];
  pagination: PaginationMeta;
}

interface VideoProcessingStatus {
  is_processed: boolean;
  encoding_progress: number;
  status: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface UserWithVideosResponse {
  user: UserProfile;
  videos: VideoWithUser[];
  count: number;
}

// ─── Cloudinary direct upload helper ────────────────────────────────────────────

async function uploadToCloudinary(
  file: File,
  params: CloudinaryUploadParams
): Promise<{ public_id: string; secure_url: string; duration?: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", params.signature);
  formData.append("timestamp", String(params.timestamp));
  formData.append("api_key", params.api_key);
  formData.append("folder", params.folder);

  if (params.resource_type) {
    formData.append("resource_type", params.resource_type);
  }
  if (params.auto_transcription) {
    formData.append("auto_transcription", params.auto_transcription);
  }

  const response = await fetch(params.upload_url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.status}`);
  }

  return response.json();
}

// ─── Upload flow ────────────────────────────────────────────────────────────────

export async function getVideoUploadParams(): Promise<CloudinaryUploadParams> {
  return apiFetch<CloudinaryUploadParams>("/api/videos/upload-url", {
    method: "POST",
  });
}

export async function getThumbnailUploadParams(): Promise<CloudinaryUploadParams> {
  return apiFetch<CloudinaryUploadParams>("/api/videos/thumbnail-url", {
    method: "POST",
  });
}

export async function uploadVideo(
  file: File
): Promise<{ public_id: string; secure_url: string; duration?: number }> {
  const params = await getVideoUploadParams();
  return uploadToCloudinary(file, params);
}

export async function uploadThumbnail(
  file: File
): Promise<{ public_id: string; secure_url: string }> {
  const params = await getThumbnailUploadParams();
  return uploadToCloudinary(file, params);
}

export async function saveVideoDetails(details: {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: string;
  duration?: number | null;
}): Promise<{ video_id: string }> {
  return apiFetch<{ video_id: string }>("/api/videos", {
    method: "POST",
    body: JSON.stringify({
      videoId: details.videoId,
      title: details.title,
      description: details.description,
      thumbnailUrl: details.thumbnailUrl,
      visibility: details.visibility,
      duration: details.duration,
    }),
  });
}

// ─── Queries ────────────────────────────────────────────────────────────────────

export async function getAllVideos(
  searchQuery: string = "",
  sortFilter?: string,
  page: number = 1,
  pageSize: number = 8
): Promise<VideoListResponse> {
  const params = new URLSearchParams();
  if (searchQuery) params.set("query", searchQuery);
  if (sortFilter) params.set("filter", sortFilter);
  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  return apiFetch<VideoListResponse>(`/api/videos?${params.toString()}`);
}

export async function getVideoById(videoId: string): Promise<VideoWithUser> {
  return apiFetch<VideoWithUser>(`/api/videos/${videoId}`);
}

export async function getTranscript(videoId: string): Promise<string> {
  const data = await apiFetch<{ transcript: string }>(
    `/api/videos/${videoId}/transcript`
  );
  return data.transcript;
}

export async function getVideoProcessingStatus(
  videoId: string
): Promise<VideoProcessingStatus> {
  return apiFetch<VideoProcessingStatus>(`/api/videos/${videoId}/status`);
}

// ─── Mutations ──────────────────────────────────────────────────────────────────

export async function incrementVideoViews(
  videoId: string
): Promise<{ views: number }> {
  return apiFetch<{ views: number }>(`/api/videos/${videoId}/views`, {
    method: "PATCH",
  });
}

export async function updateVideoVisibility(
  videoId: string,
  visibility: string
): Promise<{ visibility: string }> {
  return apiFetch<{ visibility: string }>(
    `/api/videos/${videoId}/visibility`,
    {
      method: "PATCH",
      body: JSON.stringify({ visibility }),
    }
  );
}

export async function deleteVideo(videoId: string): Promise<void> {
  await apiFetch(`/api/videos/${videoId}`, { method: "DELETE" });
}

// ─── User videos ────────────────────────────────────────────────────────────────

export async function getAllVideosByUser(
  userId: string,
  searchQuery: string = "",
  sortFilter?: string
): Promise<UserWithVideosResponse> {
  const params = new URLSearchParams();
  if (searchQuery) params.set("query", searchQuery);
  if (sortFilter) params.set("filter", sortFilter);

  return apiFetch<UserWithVideosResponse>(
    `/api/videos/user/${userId}?${params.toString()}`
  );
}
