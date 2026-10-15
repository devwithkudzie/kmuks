import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The wordmark is 799×115; shown at 44px tall.
const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/kudziemuks-logo.png"))).toString("base64")}`;

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
        <img src={logo} alt="kudziemuks" width={306} height={44} />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ fontSize: 58, lineHeight: 1.1, fontWeight: 800 }}>
            I engineer systems that help businesses win customers.
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
            Customer acquisition · Lead generation · AI integration · Automation
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#A1A1AA" }}>
          AI-powered software engineering
        </div>
      </div>
    ),
    { ...size },
  );
}
