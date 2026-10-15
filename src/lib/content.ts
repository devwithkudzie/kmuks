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
  projectSlug?: string;
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
    projectSlug: "campaign-lead-capture",
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
    projectSlug: "referral-commission-tracking",
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
    projectSlug: "client-campaign-setup-platform",
  },
];

export type Project = {
  slug: string;
  status: "Built" | "Live" | "Concept";
  statusLabel: string;
  title: string;
  /** One sentence for cards; the full summary is on the case study page. */
  brief: string;
  summary: string;
  tags: string[];
  image?: { src: string; alt: string };
  challenge: string;
  approach: string;
  contribution: string[];
  engineering: string[];
  result: string;
  solutionSlug: string;
};

export const projects: Project[] = [
  {
    slug: "client-campaign-setup-platform",
    status: "Built",
    statusLabel: "Client project",
    title: "Client Campaign Setup Platform",
    brief: "Guided setup links that collect everything needed to launch a client's campaign.",
    summary:
      "Secure setup links and template-driven forms that collect everything needed to launch a client's marketing campaign — straight into a structured record.",
    tags: ["Next.js", "TypeScript", "Google Sheets API", "Workflow engineering"],
    image: { src: "/projects/client-setup-form.png", alt: "Multi-step campaign setup form with a progress checklist" },
    challenge:
      "Launching a campaign for a building-materials supplier needed pricing, delivery, payment and customer details from the client. Collecting them over chat was slow, incomplete and hard to keep organised.",
    approach:
      "Replace the back-and-forth with a guided form the client completes once, through a private link, with questions tailored to their industry and answers saved where the team already works.",
    contribution: [
      "Designed and built the full application: client forms, admin area and data storage",
      "Created a template system so each industry gets its own questions without new code",
      "Built link management: expiry, disabling, replacing and deleting links",
      "Connected storage to Google Sheets with keyless, federated authentication",
    ],
    engineering: [
      "Next.js App Router and TypeScript, server-rendered and validated end to end with Zod",
      "Template-driven multi-step forms with conditional questions and structured answers (e.g. price per quantity)",
      "Unguessable one-time tokens, rate limiting and server-side validation of every answer",
      "Google Sheets as the data store, accessed via Workload Identity Federation — no stored service-account keys",
    ],
    result:
      "A working platform in use for real campaigns. Clients complete their setup in one guided session, and every submission arrives complete, validated and in a consistent format.",
    solutionSlug: "ai-business-applications",
  },
  {
    slug: "campaign-lead-capture",
    status: "Live",
    statusLabel: "Live system",
    title: "Campaign Lead Capture & Attribution",
    brief: "Campaign pages that capture applications, record their source and alert me instantly.",
    summary:
      "Public campaign pages that capture applications, record where each one came from, alert me instantly and organise everything for follow-up.",
    tags: ["Lead capture", "UTM attribution", "WhatsApp Cloud API", "Dashboards"],
    image: { src: "/projects/campaign-form.png", alt: "Public campaign application form for a free website offer" },
    challenge:
      "Promotional campaigns shared across Facebook, Instagram and WhatsApp produced enquiries with no reliable record of where they came from — and no prompt to follow up quickly.",
    approach:
      "Give each campaign one shareable page that captures applications as structured records, tags every one with its source, and notifies me the moment it arrives.",
    contribution: [
      "Designed and built the campaign pages, submission pipeline and admin views",
      "Implemented source attribution from campaign links and UTM tags",
      "Integrated WhatsApp alerts through Meta's WhatsApp Cloud API",
      "Built the admin dashboard for applications, sources and follow-up",
    ],
    engineering: [
      "Reusable public-campaign templates: one definition drives the page, validation and storage",
      "A separate sheet tab per campaign with columns added automatically as questions change",
      "Honeypot spam protection, rate limiting and server-side validation of every answer",
      "Notifications sent after the response, so a slow or failed alert never blocks the applicant",
    ],
    result:
      "Running live for the Free Website campaign. Every application is captured with its source and is visible in the admin dashboard for follow-up.",
    solutionSlug: "customer-acquisition-systems",
  },
  {
    slug: "referral-commission-tracking",
    status: "Concept",
    statusLabel: "Concept",
    title: "Referral & Commission Tracking",
    brief: "Crediting purchases to referrers and managing commission from one view.",
    summary:
      "A system concept for attributing customer purchases to referrers, verifying sales and managing commission records from one administrative view.",
    tags: ["Referral attribution", "Sales verification", "Commission workflows"],
    challenge:
      "Businesses that sell through affiliates or referrers struggle to prove which referrer brought which customer, and to calculate commission fairly without manual reconciliation.",
    approach:
      "Give each referrer a unique link or code, record purchases against it, verify orders before commission is approved, and show everything in one dashboard.",
    contribution: [
      "Defined the workflow from referral to verified sale to commission",
      "Designed the data model for referrers, customers, orders and payouts",
      "Planned the administrative dashboard and verification steps",
    ],
    engineering: [
      "Referral codes and links tied to campaign attribution",
      "Order verification before commission becomes payable",
      "Rule-based commission calculation with an auditable payment record",
      "An admin overview of referrer performance and outstanding commission",
    ],
    result:
      "A concept, not yet a working product. It builds directly on the attribution and lead-capture pieces already running in the projects above.",
    solutionSlug: "sales-workflow-automation",
  },
];

export const workSteps = [
  {
    title: "Understand the problem",
    body: "I examine the business process, the intended customer, existing tools and the point where opportunities are being lost.",
  },
  {
    title: "Define the right solution",
    body: "I identify what needs to be built, what can be integrated, where AI adds value and how success should be measured.",
  },
  {
    title: "Engineer and integrate",
    body: "I develop the required software, connect the relevant systems and test the solution against real workflows.",
  },
  {
    title: "Deploy and improve",
    body: "I help put the system into operation, monitor how it behaves and identify practical improvements based on usage and results.",
  },
];

export const engagements = [
  {
    title: "Discovery & technical assessment",
    body: "Define the problem, requirements, constraints and proposed approach before anything is built.",
  },
  {
    title: "Project engineering",
    body: "Build an agreed solution with a clear scope and milestones.",
  },
  {
    title: "Ongoing improvement",
    body: "Maintain, extend and refine the system as business needs evolve.",
  },
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

export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
