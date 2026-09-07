"use client";

import Script from "next/script";
import { site } from "@/lib/site";

export function LinkedInInsight() {
  const partnerId = site.linkedinPartnerId.trim();
  if (!partnerId) return null;

  return (
    <>
      <Script id="linkedin-partner" strategy="afterInteractive">
        {`
          window._linkedin_partner_id = "${partnerId}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push("${partnerId}");
        `}
      </Script>
      <Script
        id="linkedin-insight"
        src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
        strategy="lazyOnload"
      />
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
