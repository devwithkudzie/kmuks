// Case studies shown on the homepage, /case-studies and each /case-studies/<slug> page.
//
// How to update:
//   - Every section on the detail page is optional: leave a list empty (or omit it)
//     and that section is hidden. Fill them in as you gather details.
//   - Only describe what you actually built or verified. No invented results.
//   - `published: false` hides a case study everywhere.
//   - The homepage shows the first `featured` professional case study and the
//     first two `featured` personal ones.
//   - Images go in public/case-studies/ and are referenced as "/case-studies/file.png".
//     `image` is the main screenshot; `evidence` is for additional screenshots.
//   - Lines marked TODO are gaps worth filling: stack, screenshots, links, results.

export type CaseStudy = {
  slug: string; // web address: /case-studies/<slug>
  title: string;
  tagline: string; // one sentence for cards
  category: "professional" | "personal";
  type: string; // e.g. "Client project", "Independent SaaS product"
  role: string;
  stage?: string; // e.g. "Live", "In use", "Working product"
  client?: string;
  featured?: boolean;
  published: boolean;
  image?: { src: string; alt: string };
  links?: { label: string; href: string }[];
  overview: string;
  problem: string; // one direct sentence: what the problem is or was
  approach: string[];
  features?: { group?: string; items: string[] }[];
  decisions?: { title: string; body: string }[];
  engineering?: { title: string; body: string }[];
  evidence?: { src: string; alt: string; caption: string }[];
  stack?: { group: string; items: { name: string; role: string }[] }[];
  results?: string[];
  lessons?: string[];
  next?: string[];
  solutionSlug?: string; // related solution page
};

export const caseStudies: CaseStudy[] = [
  // ─── Professional ──────────────────────────────────────────────────────────
  {
    slug: "victor-holdings-campaign-platform",
    title: "Victors Holdings Campaign Setup Platform",
    tagline: "Guided setup links that collect everything needed to launch a client's marketing campaign.",
    category: "professional",
    type: "Client project",
    client: "Victors Holdings",
    role: "Design, engineering and deployment",
    stage: "In use",
    featured: true,
    published: true,
    image: { src: "/case-studies/client-setup-form.png", alt: "Multi-step campaign setup form with a progress checklist" },
    overview:
      "A web platform that replaces back-and-forth chat with a guided, private setup form. Each client gets a secure link, completes questions tailored to their industry, and every answer arrives as a complete, structured record.",
    problem:
      "Collecting the details needed to launch Victors Holdings' campaigns — pricing, delivery, payment and customer information — over WhatsApp was slow, incomplete and impossible to keep organised.",
    approach: [
      "Give the client one private link to a step-by-step form that asks exactly what's needed, in the language of their industry, and saves the answers where the team already works: Google Sheets.",
      "Rather than hard-coding one form, I built a template system: each industry template defines its questions, answer types and follow-up questions, so new clients don't need new code.",
    ],
    features: [
      {
        group: "For the client",
        items: [
          "Private, unguessable setup links with optional expiry",
          "Step-by-step form with a progress checklist and review step",
          "Structured answers: price per quantity, minimum order in units, multiple-choice and conditional follow-up questions",
          "Answers saved on the device as they go, so a reload never loses progress",
        ],
      },
      {
        group: "For the admin",
        items: [
          "Create, copy, extend, disable, replace and delete links",
          "Links grouped into Active, Expired and Disabled",
          "Dashboard of submissions filterable by organisation and campaign",
        ],
      },
    ],
    decisions: [
      {
        title: "Templates are copied onto each link",
        body: "A link stores the template it was created with, so improving a template later never changes a form a client has already received — while built-in templates can still be upgraded deliberately.",
      },
      {
        title: "Google Sheets as the data store",
        body: "The client team already worked in Sheets. Writing there removed the need for a separate admin tool for reading submissions and kept the data in a familiar place.",
      },
      {
        title: "Duplicate-safe submissions",
        body: "Each submission's reference is derived from its link, so a retried or double-clicked submit can't create a second record.",
      },
    ],
    engineering: [
      {
        title: "End-to-end validation",
        body: "Every answer is validated against the template on the server with Zod — required fields, option lists, number formats and conditional questions — regardless of what the browser sends.",
      },
      {
        title: "Keyless access to Google",
        body: "The app authenticates to Google Sheets through Workload Identity Federation with Vercel's OIDC tokens, so no service-account key is ever created or stored.",
      },
      {
        title: "Abuse protection",
        body: "Rate limiting on submissions, unguessable tokens, expiry and disable checks on every request, and admin pages protected by signed session cookies.",
      },
    ],
    stack: [
      {
        group: "Frontend",
        items: [
          { name: "Next.js (App Router)", role: "Server-rendered pages for the client form and admin area" },
          { name: "React & TypeScript", role: "Multi-step form, template-driven fields and admin tools" },
          { name: "Tailwind CSS", role: "Responsive, accessible interface" },
        ],
      },
      {
        group: "Backend & data",
        items: [
          { name: "Next.js route handlers", role: "Submission and link-management APIs" },
          { name: "Zod", role: "Validation of templates and every submitted answer" },
          { name: "Google Sheets API", role: "Stores setup links and submissions" },
        ],
      },
      {
        group: "Infrastructure",
        items: [
          { name: "Vercel", role: "Hosting and deployment" },
          { name: "Google Cloud Workload Identity Federation", role: "Keyless authentication to Google APIs" },
        ],
      },
    ],
    results: [
      "In use for Victors Holdings' campaign setup: the client completes their information in one guided session.",
      "Every submission arrives complete, validated and in a consistent format, ready to plan the campaign from.",
    ],
    lessons: [
      "Separating the client's identity from the form template made the platform reusable for other industries without code changes.",
    ],
    next: ["Add templates for more industries as new clients come on board."],
    solutionSlug: "customer-acquisition-systems",
  },
  {
    slug: "omniforce-talent-marketplace",
    title: "OmniForce Talent Marketplace",
    tagline: "Engineering contributions to an enterprise talent marketplace.",
    category: "professional",
    type: "Professional engagement",
    role: "Software engineer", // TODO: confirm your exact title and the team you worked in
    published: true,
    overview:
      "OmniForce is a talent marketplace connecting organisations with talent. I worked on the application as part of the engineering team.",
    // TODO: confirm this problem statement for OmniForce.
    problem:
      "Organisations needed one place to find, request and manage talent, with profiles, search and administrative review.",
    approach: [
      "My contribution covered application workflows, backend and API work, data handling, testing and deployment preparation.",
    ],
    features: [
      {
        group: "Workflows I worked on",
        // TODO: confirm which of these you personally built.
        items: ["Profiles", "Search", "Requests", "Administrative review"],
      },
    ],
    // TODO: add engineering details, approved screenshots (evidence), stack and results.
  },

  // ─── Personal ──────────────────────────────────────────────────────────────
  {
    slug: "kudziemuks-lead-capture",
    title: "Kudziemuks Lead Capture & Enquiry Experience",
    tagline: "My own site: positioning, enquiry capture, campaign pages and source tracking.",
    category: "personal",
    type: "Own-brand website and lead-generation system",
    role: "Design, engineering and content",
    stage: "Live",
    featured: true,
    published: true,
    image: { src: "/case-studies/kudziemuks-home.png", alt: "The Kudziemuks homepage" },
    links: [{ label: "Visit the live site", href: "/" }],
    overview:
      "The website you're on: a service site built around customer acquisition principles — clear positioning, a focused enquiry journey, campaign landing pages, and every lead captured with where it came from.",
    problem:
      "Sending visitors straight to WhatsApp left no record of where leads came from and no structured details to follow up on.",
    approach: [
      "I structured the site around one question for each page — what do I do, how, and what to do next — with every call to action leading to a single enquiry form.",
      "Enquiries and campaign applications are captured as structured records with their source, then made visible in an admin dashboard.",
    ],
    features: [
      {
        items: [
          "Start a Project enquiry form with validation, spam protection and rate limiting",
          "Public campaign pages, such as the Free Website campaign, that accept many applications",
          "Source tracking from campaign links and UTM tags",
          "Each campaign saved to its own Google Sheets tab, with columns added automatically",
          "Admin dashboard and application list for follow-up",
          "Insights blog written in Markdown, with scheduled publishing",
          "Google Analytics conversion event on every enquiry",
        ],
      },
    ],
    decisions: [
      {
        title: "Structured enquiries instead of chat links",
        body: "Replacing direct WhatsApp links with a short form means every lead arrives with the same details and its source.",
      },
      {
        title: "Notifications never block the visitor",
        body: "New-lead alerts are sent after the response is returned, so a slow or failed notification can never make a successful enquiry look like it failed.",
      },
    ],
    engineering: [
      {
        title: "One template, many campaigns",
        body: "A campaign's questions, page copy and validation come from a single template definition, so a new promotion is a data change rather than a new page.",
      },
      {
        title: "Content as files",
        body: "Articles are Markdown files with validated frontmatter; future-dated posts stay hidden until their date and pages refresh hourly, so scheduled posts go live without a redeploy.",
      },
    ],
    evidence: [
      { src: "/case-studies/kudziemuks-enquiry.png", alt: "Start a Project enquiry form", caption: "The Start a Project form, the destination of every call to action." },
      { src: "/case-studies/campaign-form.png", alt: "Free Website campaign application form", caption: "A public campaign page that captures applications with their source." },
    ],
    stack: [
      {
        group: "Frontend",
        items: [
          { name: "Next.js (App Router)", role: "Static and server-rendered pages with hourly revalidation" },
          { name: "React & TypeScript", role: "Forms, navigation and interactive components" },
          { name: "Tailwind CSS", role: "Theming (light site, dark admin) and responsive layout" },
        ],
      },
      {
        group: "Data & integrations",
        items: [
          { name: "Google Sheets API", role: "Stores enquiries and campaign applications" },
          { name: "Zod", role: "Validation of forms, templates and article metadata" },
          { name: "Google Analytics 4", role: "Measures enquiries as conversions" },
          { name: "Meta WhatsApp Cloud API", role: "New-lead notifications" },
        ],
      },
      {
        group: "Delivery",
        items: [{ name: "Vercel", role: "Hosting, deployment and edge caching" }],
      },
    ],
    results: [
      "Live at kudziemuks.co.zw: enquiries and campaign applications are captured with their source and visible in the admin dashboard.",
    ],
    next: ["Switch on WhatsApp lead alerts once the Meta message template is approved."],
    solutionSlug: "customer-acquisition-systems",
  },
  {
    slug: "referral-to-revenue",
    title: "Referral-to-Revenue Tracking System",
    tagline: "Connecting referrals to real purchases and tracking the commission owed.",
    category: "personal",
    type: "Independent product",
    role: "Product design and engineering",
    stage: "Working product",
    featured: true,
    published: true,
    // TODO: add a screenshot to public/case-studies/ and set `image`.
    overview:
      "A system for businesses that sell through affiliates or referrers: every referral is attributed, every purchase verified, and every commission calculated and tracked to payment.",
    problem:
      "Businesses running referral campaigns can't prove which referrer brought in which customer, so commission is worked out by hand.",
    approach: [
      "Give every affiliate a unique referral identifier, attribute each order to it, and verify the order before any commission becomes payable — with dashboards for both affiliates and administrators.",
    ],
    features: [
      {
        items: [
          "Affiliate registration with unique referral identifiers",
          "Referral attribution and order verification",
          "Commission rules and payment status",
          "Affiliate and administrator dashboards",
        ],
      },
    ],
    // TODO: add engineering details, stack, screenshots and links.
    solutionSlug: "revenue-tracking",
  },
  {
    slug: "tredem-headline-optimizer",
    title: "Tredem — AI-Powered LinkedIn Headline Optimizer",
    tagline: "An AI tool that helps professionals position their expertise clearly on LinkedIn.",
    category: "personal",
    type: "Independent SaaS product",
    role: "Product design and engineering",
    stage: "Working product",
    published: true,
    // TODO: add a screenshot, a link to the live product, and the stack.
    overview:
      "Tredem analyses a professional's LinkedIn headline against their career or business goals, explains what's working, and suggests clearer alternatives. It also includes Fit Call, a booking workflow for discovery conversations.",
    problem:
      "Professionals struggle to show their expertise clearly on LinkedIn, and their headline — the most visible line on a profile — is often vague or generic.",
    approach: [
      "Ask for the person's goals first, then assess the headline against them with a clear verdict and concrete alternatives, rather than generic writing tips.",
    ],
    features: [
      {
        group: "Headline Optimizer",
        items: [
          "Input of career or business goals alongside the current headline",
          "Headline analysis and recommendations",
          "Clear assessments: KEEP, REFINE, REPOSITION or CLARIFY",
          "Suggested headline variations",
        ],
      },
      {
        group: "Fit Call booking",
        items: [
          "Booking and intake flow",
          "Calendar availability and appointment creation",
          "Google Meet links created automatically",
          "Confirmation and attendee notifications",
        ],
      },
    ],
    stack: [
      {
        group: "Integrations",
        items: [
          { name: "Google Calendar API", role: "Availability and appointment creation for Fit Call" },
          { name: "Google Meet", role: "Meeting links for booked calls" },
        ],
      },
      // TODO: add the frontend, backend and AI model/services you used.
    ],
  },
  {
    slug: "soliddesk",
    title: "SolidDesk — AI Furniture Visualisation & Commerce",
    tagline: "Customers see AI-generated furniture in their own room before requesting a quote.",
    category: "personal",
    type: "Independent commerce platform",
    role: "Product design and engineering",
    stage: "Working product",
    published: true,
    // TODO: add screenshots, links and the stack (including the image-generation service).
    overview:
      "A commerce platform for custom furniture: customers upload a photo of their room, see AI-generated furniture concepts in it, and request a quote — while the business manages quotations, carpenters and orders behind the scenes.",
    problem:
      "Customers can't picture custom furniture in their own space before requesting a quote, and the business has no single system for quotes, carpenters and orders.",
    approach: [
      "Use AI image generation to show the customer the piece in their own room, then turn that interest into a structured quote request that flows into an admin workflow.",
    ],
    features: [
      {
        group: "For customers",
        items: [
          "Room-photo uploads with AI-generated furniture concepts",
          "Furniture selection by style and dimensions",
          "Quote requests with customer lead capture",
        ],
      },
      {
        group: "For the business",
        items: ["Quotation management", "Carpenter assignment", "Order tracking"],
      },
    ],
    solutionSlug: "customer-acquisition-systems",
  },
];

export const publishedCaseStudies = caseStudies.filter((study) => study.published);

export function caseStudyBySlug(slug: string) {
  return publishedCaseStudies.find((study) => study.slug === slug);
}

/** Homepage selection: one featured professional case study and two featured personal ones. */
export function featuredCaseStudies() {
  const featured = publishedCaseStudies.filter((study) => study.featured);
  return [
    ...featured.filter((study) => study.category === "professional").slice(0, 1),
    ...featured.filter((study) => study.category === "personal").slice(0, 2),
  ];
}

export const categoryLabels: Record<CaseStudy["category"], string> = {
  professional: "Professional",
  personal: "Personal project",
};
