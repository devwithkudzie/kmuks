export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  body: string[];
};

export const insights: Insight[] = [
  {
    slug: "why-more-marketing-doesnt-mean-more-customers",
    title: "Why doing more marketing doesn't automatically mean more customers",
    excerpt:
      "Posting more, running more ads or being on every channel isn't the fix if the real gap is somewhere else in the customer journey.",
    date: "2026-01-12",
    readTime: "4 min read",
    body: [
      "Most businesses respond to slow growth by doing more of what they're already doing — more posts, more ads, more channels. But volume isn't the same as direction.",
      "Before recommending what to fix, it's worth figuring out where the real gap is: is it that people don't know you exist, that your message isn't landing, or that enquiries are falling through the cracks after someone reaches out?",
      "Each of those problems has a completely different fix. Getting the diagnosis right matters more than doing more of any one activity.",
    ],
  },
  {
    slug: "customer-journey-not-channel-list",
    title: "Think in customer journeys, not channel lists",
    excerpt:
      "LinkedIn, Facebook, Instagram and TikTok aren't a checklist. The customer determines which channels are worth showing up on.",
    date: "2026-02-03",
    readTime: "3 min read",
    body: [
      "It's tempting to treat marketing as a list of channels to be present on. But being everywhere isn't a strategy — it's a way to spread your effort thin.",
      "The better starting point is the customer journey: how do the people you want to reach actually find businesses like yours, and what happens between that first moment of attention and them becoming a customer?",
      "Once that journey is clear, the right channels tend to reveal themselves — and so does everything else you need to build around them.",
    ],
  },
  {
    slug: "what-happens-after-they-enquire",
    title: "What happens after someone enquires matters as much as getting the enquiry",
    excerpt:
      "Businesses can spend heavily on generating attention and then quietly lose customers after the click.",
    date: "2026-02-21",
    readTime: "3 min read",
    body: [
      "A lot of marketing effort is spent getting someone to raise their hand — a click, a message, a form fill. Far less attention goes to what happens next.",
      "If enquiries sit unanswered, get a slow or generic response, or simply fall through the cracks, all that upstream effort is wasted.",
      "Improving what happens after someone enquires is often the fastest, cheapest way to bring in more customers from the traffic you already have.",
    ],
  },
];

export function getInsightBySlug(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}

export function getAdjacentInsights(slug: string) {
  const index = insights.findIndex((insight) => insight.slug === slug);
  return {
    previous: index > 0 ? insights[index - 1] : null,
    next: index >= 0 && index < insights.length - 1 ? insights[index + 1] : null,
  };
}
