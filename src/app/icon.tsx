import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0D",
          color: "#A78BFA",
          fontSize: 11,
          letterSpacing: 1,
          fontFamily: "Helvetica, sans-serif",
        }}
      >
        KM
      </div>
    ),
    { ...size },
  );
}
