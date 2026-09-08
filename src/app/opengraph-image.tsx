import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0D",
          color: "#F5F5F7",
          padding: 72,
          fontFamily: "Inter, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 10,
            color: "#A78BFA",
          }}
        >
          KUDZIEMUKS
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ fontSize: 58, lineHeight: 1.1, fontWeight: 800 }}>
            expertise alone isn’t enough.
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 32,
              color: "#A78BFA",
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            it’s time to stop relying on word-of-mouth.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#A1A1AA" }}>
          digital authority for african founders and premium brands
        </div>
      </div>
    ),
    { ...size },
  );
}
