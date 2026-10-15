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
    stage: "01 · Attract",
    title: "Customer Acquisition Systems",
    image: { src: "/how-publish.jpg", alt: "A person browsing a business's page on a phone" },
    summary: "Capture leads, track referrals and turn campaigns into measurable opportunities.",
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
    title: "Sales & Workflow Automation",
    image: { src: "/how-recommend.jpg", alt: "A team discussing a sales process around a laptop" },
    summary: "Connect enquiries, orders, follow-ups and sales operations.",
    intro:
      "I help businesses manage prospects, coordinate follow-ups and reduce the manual work between an enquiry and a completed sale.",
    capabilities: [
      "Customer and sales pipeline management",
      "Automated notifications and follow-up reminders",
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
    projectSlug: "referral-to-revenue",
  },
  {
    slug: "ai-business-applications",
    stage: "03 · Intelligence",
    title: "AI-Powered Business Applications",
    image: { src: "/how-repurpose.jpg", alt: "A professional working in a business application on a laptop" },
    summary: "Build intelligent tools that simplify complex business processes.",
    intro:
      "I build custom software that uses AI and connected data to help businesses handle information more efficiently and make better-informed decisions.",
    capabilities: [
      "AI-assisted enquiry handling",
      "Intelligent information extraction and classification",
      "Custom business dashboards",
      "Integrations between existing tools and data",
    ],
    problem: [
      "Teams spend hours reading, sorting and re-typing information from enquiries, documents and messages.",
      "Data sits in separate tools, so it is hard to get one clear view of what is happening in the business.",
    ],
    approach: [
      { title: "AI where it helps", body: "Language models classify enquiries, extract key details and summarise conversations — applied to specific steps, not added for their own sake." },
      { title: "Human in control", body: "AI suggestions are reviewable, and important decisions stay with the team." },
      { title: "Connected data", body: "Existing tools are connected through APIs so information flows without re-entry." },
      { title: "One clear view", body: "Dashboards bring activity, orders and status together in one place." },
    ],
    suits: [
      "Businesses handling a high volume of enquiries or documents",
      "Teams working across several disconnected tools",
      "Managers who need a reliable overview without manual reporting",
    ],
    example:
      "An administrative dashboard that consolidates affiliate activity, customer orders and commission status, with AI-assisted insights where useful.",
    projectSlug: "victor-holdings-campaign-platform",
  },
];

// How I Work: descriptive titles only — the steps should read at a glance.
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
  { area: "Data & integrations", items: ["SQL / MySQL", "REST APIs", "Google Workspace APIs", "Connected business systems"] },
  { area: "AI engineering", items: ["AI API integration", "Locally hosted language models"] },
  { area: "Delivery", items: ["Docker", "Vercel", "Deployment & maintenance"] },
];

export function solutionBySlug(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

