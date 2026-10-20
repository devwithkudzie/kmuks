// Site copy shared by the homepage and the full pages, so the two never drift apart.
// Voice: first person ("I"). No guaranteed leads, conversions or revenue.

export type Solution = {
  slug: string;
  stage: string;
  title: string;
  summary: string;
  /** Photo for cards, from /public. */
  image: { src: string; alt: string };
  intro: string;
  capabilities: string[];
  problem: string[];
  approach: { title: string; body: string }[];
  suits: string[];
  example: string;
  projectSlug?: string; // related case study
};

export const solutions: Solution[] = [
  {
    slug: "customer-acquisition-systems",
    stage: "01 · Capture",
    title: "Lead Capture Systems",
    image: { src: "/how-publish.jpg", alt: "A person browsing a business's page on a phone" },
    summary: "Never miss an enquiry again. Every ad, form and WhatsApp message lands in one place.",
    intro:
      "I help businesses turn marketing activity into trackable customer opportunities — so every campaign, referral and enquiry lands somewhere it can be followed up and measured.",
    capabilities: [
      "Campaign landing pages and enquiry forms",
      "Lead capture and qualification",
      "Referral and affiliate tracking",
      "Lead-source attribution and reporting",
    ],
    problem: [
      "Many businesses spend on marketing without knowing which campaigns, referrers or channels actually produce customers.",
      "Enquiries arrive through scattered messages and forms, details go missing, and referrals are hard to credit to the right person.",
    ],
    approach: [
      { title: "Focused entry points", body: "Campaign pages and enquiry forms designed around one clear next step, asking only what the business needs to follow up." },
      { title: "Structured capture", body: "Every enquiry is saved as a structured record — not a message buried in a chat — with validation and spam protection." },
      { title: "Source attribution", body: "Campaign links, UTM tags and referral codes record where each opportunity came from." },
      { title: "Visible results", body: "Dashboards and sheets show how many opportunities each campaign or referrer produces." },
    ],
    suits: [
      "Businesses running campaigns that need to know what works",
      "Companies with agents, affiliates or dealer networks",
      "Service businesses that rely on a steady flow of enquiries",
    ],
    example:
      "An affiliate campaign for a building-materials supplier, where each referral is attributed to the marketer who brought it in.",
    projectSlug: "kudziemuks-lead-capture",
  },
  {
    slug: "sales-workflow-automation",
    stage: "02 · Convert",
    title: "CRM & Follow-Up Automation",
    image: { src: "/how-recommend.jpg", alt: "A team discussing a sales process around a laptop" },
    summary: "Turn enquiries into paying customers with a clear pipeline and automatic follow-ups.",
    intro:
      "I help businesses manage prospects, coordinate follow-ups and reduce the manual work between an enquiry and a completed sale.",
    capabilities: [
      "CRM setup and sales pipelines (Zoho CRM and others)",
      "Automated WhatsApp and email follow-ups",
      "Order and referral verification",
      "Commission calculation and payment records",
    ],
    problem: [
      "Opportunities are often lost after the enquiry: replies are slow, follow-ups depend on memory, and nobody can see where each prospect stands.",
      "When sales involve referrers or agents, verifying orders and working out commission becomes slow, manual and error-prone.",
    ],
    approach: [
      { title: "A clear pipeline", body: "Every prospect has a status, an owner and a history, so nothing depends on someone remembering." },
      { title: "Timely notifications", body: "New enquiries and key events trigger instant alerts — for example on WhatsApp — so responses don't wait." },
      { title: "Verified records", body: "Orders are matched to the right customer and referrer before anything is paid out." },
      { title: "Automatic calculations", body: "Commission and payment records are calculated from agreed rules instead of spreadsheets maintained by hand." },
    ],
    suits: [
      "Growing businesses with manual sales processes",
      "Distributors and manufacturers selling through referrers or dealers",
      "Teams that lose track of follow-ups between tools",
    ],
    example:
      "Recording a customer's purchase against the correct referrer and calculating the commission owed.",
    projectSlug: "victor-holdings-campaign-platform",
  },
  {
    slug: "revenue-tracking",
    stage: "03 · Measure",
    title: "Revenue Tracking",
    image: { src: "/how-repurpose.jpg", alt: "A professional reviewing a business dashboard on a laptop" },
    summary: "Know exactly which ads, referrals and campaigns make you money.",
    intro:
      "I connect your marketing, enquiries and sales so you can see which campaigns, referrers and channels actually produce paying customers — not just clicks.",
    capabilities: [
      "Enquiry-to-sale tracking by campaign and referrer",
      "Dashboards for cost per lead, conversion rate and revenue",
      "Referral and commission reporting",
      "AI-assisted summaries of what is working",
    ],
    problem: [
      "Most businesses can see how much they spend on marketing, but not which ad or referral turned into a sale.",
      "Sales close in WhatsApp chats and phone calls, so the link between the campaign and the money is lost.",
    ],
    approach: [
      { title: "Every sale has a source", body: "Each enquiry carries the campaign, ad or referral code that brought it in, all the way to the sale." },
      { title: "One clear dashboard", body: "Enquiries, conversion rates and revenue by campaign and referrer, in one place." },
      { title: "Accurate referral payouts", body: "Commissions are calculated from verified sales, so referrers are paid correctly and on time." },
      { title: "AI where it helps", body: "Summaries and alerts point out which campaigns are performing and where deals stall." },
    ],
    suits: [
      "Businesses spending on ads without knowing what they return",
      "Companies running referral or affiliate programmes",
      "Agencies that need to prove results to their clients",
    ],
    example:
      "A brick supplier seeing which Meta ads and which referrers produced paying customers, and how much each campaign returned.",
    projectSlug: "referral-to-revenue",
  },
];

// How I Work: descriptive titles only — the steps should read at a glance.
// The customer journey every engagement follows, from first impression to proven result.
export const journey = [
  { stage: "Get chosen", body: "Positioning and content that make you the business people notice, remember and trust." },
  { stage: "Capture", body: "Landing pages, forms and WhatsApp flows that catch every enquiry and record where it came from." },
  { stage: "Convert", body: "A CRM pipeline with automatic follow-ups, so no enquiry is forgotten before it becomes a sale." },
  { stage: "Measure", body: "Dashboards that show which ads, referrals and campaigns actually make you money." },
];

// Packages: no prices shown on the site for now. `slug` is also an option on the Start a Project form.
export type ServicePackage = { slug: string; title: string; tagline: string; includes: string[]; highlight?: boolean };

export const packages: ServicePackage[] = [
  {
    slug: "customer-leak-audit",
    title: "Customer Leak Audit",
    tagline: "Find out where you're losing customers.",
    includes: [
      "Review of your website, ads, WhatsApp and follow-up process",
      "A test enquiry to see how quickly and how well you respond",
      "A short report and video walkthrough of the top leaks and how to fix them",
    ],
  },
  {
    slug: "customer-acquisition-systems",
    title: "Lead Capture System",
    tagline: "Never miss an enquiry again.",
    includes: [
      "Landing page or enquiry form built around your offer",
      "Click-to-WhatsApp ads and forms tagged by campaign",
      "Every enquiry saved automatically, with an instant reply",
    ],
  },
  {
    slug: "sales-workflow-automation",
    title: "CRM & Follow-Up Automation",
    tagline: "Turn enquiries into paying customers.",
    includes: [
      "CRM pipeline set up around how you actually sell",
      "Lead assignment, follow-up reminders and quote chasing",
      "WhatsApp and email follow-ups when a lead goes quiet",
    ],
  },
  {
    slug: "revenue-tracking",
    title: "Revenue Tracking Dashboard",
    tagline: "Know which marketing makes you money.",
    includes: [
      "Enquiries and sales traced back to each ad and referrer",
      "Cost per lead, conversion rate and revenue by campaign",
      "Referral and commission reporting",
    ],
  },
  {
    slug: "complete-customer-engine",
    title: "Complete Customer Engine",
    tagline: "The whole journey, from first impression to proven result.",
    includes: [
      "Positioning session so your message matches your system",
      "Lead capture, CRM and follow-up automation",
      "Revenue tracking dashboard",
    ],
    highlight: true,
  },
  {
    slug: "growth-partner-retainer",
    title: "Growth Partner Retainer",
    tagline: "Keep it running and keep improving it.",
    includes: [
      "Monitoring, fixes and a monthly results report",
      "One new automation or improvement each month",
      "A monthly strategy call",
    ],
  },
];

// Tools I set up and connect for clients.
export const tools = ["Zoho CRM", "ClickUp", "n8n", "WhatsApp Business", "Meta Ads", "Google Workspace"];

export const workSteps = [
  "Understand the problem and where opportunities are lost",
  "Decide what to build, integrate or automate",
  "Launch, monitor and keep improving",
];

export const engagements = [
  "Discovery: define the problem and the right approach",
  "Project: build an agreed solution with clear milestones",
  "Ongoing: maintain and extend the system as you grow",
];

export const techStack = [
  { area: "Software engineering", items: ["Python", "FastAPI", "JavaScript / TypeScript", "React / Next.js"] },
  { area: "CRM & automation", items: ["Zoho CRM", "ClickUp", "n8n", "WhatsApp Business"] },
  { area: "Data & integrations", items: ["SQL / MySQL", "REST APIs", "Google Workspace APIs", "Connected business systems"] },
  { area: "AI engineering", items: ["AI API integration", "Locally hosted language models"] },
  { area: "Delivery", items: ["Docker", "Vercel", "Deployment & maintenance"] },
];

export function packageBySlug(slug: string) {
  return packages.find((item) => item.slug === slug);
}

export function solutionBySlug(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

