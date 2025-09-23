"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload as IconUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  content,
}: {
  onChange?: (files: File[]) => void;
  content: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validTypes = ["application/pdf", "text/plain"];

  const validateFiles = (newFiles: File[]) => {
    const tenMB = 10 * 1024 * 1024;
    if (newFiles.length > 2) {
      toast.error("Please upload only PDF or TXT files");
      return false;
    }
    for (const file of newFiles) {
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload only PDF or TXT files");
        return false;
      }
      if (file.size > tenMB) {
        toast.error("Please upload files less than 10 MB");
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (newFiles: File[]) => {
    if (!newFiles.length) return;
    if (validateFiles(newFiles)) {
      setFiles(newFiles);
      onChange && onChange(newFiles);
    } else {
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    accept: {
      "application/pdf": [],
      "text/plain": [],
    },
    onDrop: handleFileChange,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          switch (error.code) {
            case "file-invalid-type":
              toast.error("Please upload only PDF or TXT files");
              break;
            case "file-too-large":
              toast.error("File is too large");
              break;
            default:
              toast.error("Error uploading file");
          }
        });
      });
    },
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined,
  });

  return (
    <div className="h-full w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block h-full w-full cursor-pointer overflow-hidden rounded-lg p-10"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="application/pdf,text/plain"
          multiple
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            Upload files
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
            {content}
          </p>
          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {files.length > 0 ? (
              <motion.div
                layoutId="file-upload"
                className={cn(
                  "relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 dark:bg-neutral-900 md:h-24",
                  "shadow-sm"
                )}
              >
                <div className="flex w-full flex-col gap-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4"
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                      >
                        {file.name}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 shadow-input dark:bg-neutral-800 dark:text-white"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative z-40 mx-auto mt-4 flex h-32 w-full max-w-32 items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-neutral-600"
                  >
                    Drop it
                    <IconUpload className="size-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="size-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}
            {files.length === 0 && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-32 items-center justify-center rounded-md border border-dashed border-primary bg-transparent opacity-0"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 11;
  const rows = 11;
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex size-10 shrink-0 rounded-xl m-4 ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
