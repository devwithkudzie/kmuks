import type { AssetFile } from "@/lib/client-setup/schema";

export type UploadItem = {
  localId: string;
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
  result?: AssetFile;
};
