"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScreenRecording } from "@/lib/hooks/useScreenRecording";
import { ICONS } from "@/constants";

const RecordScreen = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    isRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useScreenRecording();

  const closeModal = () => {
    resetRecording();
    setIsOpen(false);
  };

  const handleStart = async () => {
    await startRecording();
  };

  const recordAgain = async () => {
    resetRecording();
    await startRecording();
    if (recordedVideoUrl && videoRef.current)
      videoRef.current.src = recordedVideoUrl;
  };

  const goToUpload = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    sessionStorage.setItem(
      "recordedVideo",
      JSON.stringify({
        url,
        name: "screen-recording.webm",
        type: recordedBlob.type,
        size: recordedBlob.size,
        duration: recordingDuration || 0, // Store the duration with the video data
      })
    );
    router.push("/upload");
    closeModal();
  };

  return (
    <div className="record">
      <button
        onClick={() => setIsOpen(true)}
        className="primary-btn transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]"
      >
        <Image
          src={ICONS.record}
          alt="record"
          width={16}
          height={16}
          className="transition-transform duration-150"
        />
        <span className="truncate">Record a video</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="overlay-record" onClick={closeModal} />
            <motion.div
              className="dialog-content"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <figure>
                <h3>Screen Recording</h3>
                <button
                  onClick={closeModal}
                  className="transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]"
                >
                  <Image src={ICONS.close} alt="Close" width={20} height={20} />
                </button>
              </figure>

              <section>
                {isRecording ? (
                  <article>
                    <div />
                    <span>Recording in progress...</span>
                  </article>
                ) : recordedVideoUrl ? (
                  <video ref={videoRef} src={recordedVideoUrl} controls />
                ) : (
                  <p>Click record to start capturing your screen</p>
                )}
              </section>

              <div className="record-box">
                {!isRecording && !recordedVideoUrl && (
                  <button
                    onClick={handleStart}
                    className="record-start transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]"
                  >
                    <Image
                      src={ICONS.record}
                      alt="record"
                      width={16}
                      height={16}
                    />
                    Record
                  </button>
                )}
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="record-stop transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]"
                  >
                    <Image
                      src={ICONS.record}
                      alt="record"
                      width={16}
                      height={16}
                    />
                    Stop Recording
                  </button>
                )}
                {recordedVideoUrl && (
                  <>
                    <button
                      onClick={recordAgain}
                      className="record-again transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]"
                    >
                      Record Again
                    </button>
                    <button
                      onClick={goToUpload}
                      className="record-upload transition-all duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]"
                    >
                      <Image
                        src={ICONS.upload}
                        alt="Upload"
                        width={16}
                        height={16}
                      />
                      Continue to Upload
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecordScreen;
