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
          background: "transparent",
          fontSize: 34,
          fontWeight: 900,
          fontFamily: "Helvetica, sans-serif",
        }}
      >
        <span
          style={{
            color: "#000000",
            textShadow: "0 0 1px #000000, 0 0 1px #000000",
          }}
        >
          k
        </span>
        <span
          style={{
            color: "#A78BFA",
            textShadow: "0 0 1px #A78BFA, 0 0 1px #A78BFA",
          }}
        >
          .
        </span>
      </div>
    ),
    { ...size },
  );
}
