"use client";
import Link from "next/link";
import { useEdgeStore } from "@/lib/edgestore";
import { FC, useEffect, useState } from "react";
import styles from "./page.module.css";
import DownolandImage from "../../public/upload_icon.png";
import Image from "next/image";

type URLs = {
  url: string;
  thumbnailUrl: string | null;
};

export default function Home() {
  const [progress, setProgress] = useState<number>(0);
  const [urls, setUrls] = useState<URLs>();
  const [file, setFile] = useState<File | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();
  const URLsContent: FC = () => {
    if (!urls) {
      return null;
    }

    if (urls?.url && urls?.thumbnailUrl) {
      return (
        <Link href={urls?.thumbnailUrl} target="_blank">
          <Image alt={urls.url} src={urls?.url} width={300} height={300} />
        </Link>
      );
    }
  };

  useEffect(() => {
    const handleDisabled = () => {
      if (progress === 100) {
        setDisabled(() => false);
      }
    };
    return () => handleDisabled();
  }, [progress]);

  return (
    <main className={styles.main}>
      <div className={styles.headerContent}>
        <div className={styles.uploadContainer}>
          <label className={styles.uploadLabel}>
            <input
              id="file"
              type="file"
              accept="image/**"
              onChange={(e) => {
                const file = e?.target?.files?.[0];
                if (!file) {
                  setFile(() => null);
                  return;
                }
                setFile(() => file);
              }}
              hidden
            />
            <div className={styles.uploadContent}>
              <Image
                src={DownolandImage}
                width={100}
                height={100}
                alt="downoland"
              />
              <h2>{file ? "Selected" : "Select image"}</h2>
            </div>
          </label>

          <button
            className={styles.uploadButton}
            onClick={async () => {
              if (!file) {
                setDisabled(() => false);
                return;
              }
              const { url, thumbnailUrl } =
                await edgestore.myPublicImages.upload({
                  file: file,
                  onProgressChange: (progress) => {
                    setProgress(() => progress);
                  },
                });
              setUrls({ url, thumbnailUrl });
              setDisabled(() => true);
            }}
            disabled={disabled}
          >
            upload
          </button>
          <div
            style={{
              width: "100%",
              border: "1px solid green",
              borderRadius: 5,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: "green",
                height: 5,
                transition: ".3s",
              }}
            />
          </div>
        </div>
      </div>

      <URLsContent />
    </main>
  );
}
