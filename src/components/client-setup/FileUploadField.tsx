"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import type { AssetCategory } from "@/lib/client-setup/constants";
import { MAX_FILES_PER_CATEGORY, fileSizeLimitFor, formatFileSize } from "@/lib/client-setup/constants";
import { focusRing } from "./styles";
import type { UploadItem } from "./uploadTypes";

function uploadFileWithProgress({
  file,
  campaignId,
  category,
  onProgress,
}: {
  file: File;
  campaignId: string;
  category: string;
  onProgress: (percent: number) => void;
}) {
  return new Promise<{ fileId: string; url: string; name: string; size: number; mimeType: string; category: string }>(
    (resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("campaignId", campaignId);
      formData.append("category", category);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/client-setup/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const body = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(body);
          } else {
            reject(new Error(body.error || "Upload failed."));
          }
        } catch {
          reject(new Error("Upload failed."));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload."));
      xhr.send(formData);
    },
  );
}

export function FileUploadField({
  category,
  campaignId,
  items,
  onItemsChange,
}: {
  category: AssetCategory;
  campaignId: string;
  items: UploadItem[];
  onItemsChange: (items: UploadItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const updateItem = (localId: string, patch: Partial<UploadItem>) => {
    onItemsChange(items.map((item) => (item.localId === localId ? { ...item, ...patch } : item)));
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = category.multiple ? Array.from(fileList) : [fileList[0]];
    const remainingSlots = MAX_FILES_PER_CATEGORY - items.length;
    const filesToUpload = files.slice(0, Math.max(remainingSlots, category.multiple ? 0 : 1));

    for (const file of filesToUpload) {
      const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const sizeLimit = fileSizeLimitFor();

      if (file.size > sizeLimit) {
        onItemsChange([
          ...items,
          {
            localId,
            name: file.name,
            size: file.size,
            status: "error",
            progress: 0,
            error: `Too large — maximum is ${formatFileSize(sizeLimit)}.`,
          },
        ]);
        continue;
      }

      const newItem: UploadItem = {
        localId,
        name: file.name,
        size: file.size,
        status: "uploading",
        progress: 0,
      };
      onItemsChange([...items, newItem]);

      uploadFileWithProgress({
        file,
        campaignId,
        category: category.id,
        onProgress: (percent) => updateItem(localId, { progress: percent }),
      })
        .then((result) => {
          updateItem(localId, {
            status: "done",
            progress: 100,
            result: {
              category: result.category,
              name: result.name,
              url: result.url,
              fileId: result.fileId,
              size: result.size,
              mimeType: result.mimeType,
            },
          });
        })
        .catch((error: Error) => {
          updateItem(localId, { status: "error", error: error.message });
        });
    }
  };

  const removeItem = (localId: string) => {
    onItemsChange(items.filter((item) => item.localId !== localId));
  };

  const canAddMore = items.length < MAX_FILES_PER_CATEGORY && (category.multiple || items.length === 0);

  return (
    <div className="mt-6 first:mt-0">
      <p className="text-[0.7rem] font-medium tracking-[0.16em] text-mist uppercase">
        {category.label}
      </p>
      <p className="mt-1 text-xs text-mist/70">{category.helpText}</p>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.localId}
            className="flex items-center gap-3 rounded-md border border-white/5 bg-night px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-fog">{item.name}</p>
              <p className="mt-0.5 text-xs text-mist/70">
                {formatFileSize(item.size)}
                {item.status === "uploading" ? ` · Uploading ${item.progress}%` : null}
                {item.status === "done" ? " · Uploaded" : null}
                {item.status === "error" ? ` · ${item.error}` : null}
              </p>
              {item.status === "uploading" ? (
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              aria-label={`Remove ${item.name}`}
              onClick={() => removeItem(item.localId)}
              className={`shrink-0 rounded-full p-2 text-mist transition hover:bg-white/10 hover:text-fog ${focusRing}`}
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>

      {canAddMore ? (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`mt-3 inline-flex min-h-11 items-center rounded-md border border-white/5 bg-night px-4 text-sm text-mist transition hover:bg-white/10 hover:text-fog ${focusRing}`}
          >
            {items.length > 0 ? "Add another file" : "Choose file"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={category.accept}
            multiple={category.multiple}
            className="sr-only"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </>
      ) : null}
    </div>
  );
}
