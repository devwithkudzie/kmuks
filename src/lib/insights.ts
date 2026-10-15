import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

// Articles are Markdown files in src/content/insights (see the README there).
const DIRECTORY = join(process.cwd(), "src/content/insights");

const frontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  excerpt: z.string().min(1, "excerpt is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must look like 2026-10-20"),
  category: z.string().default("Insights"),
  cover: z.string().regex(/^\//, "cover must start with / e.g. /insights/image.jpg").optional(),
  draft: z.enum(["true", "false"]).optional(),
});

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  cover?: string;
  draft: boolean;
  readTime: string;
  body: string;
};

/** Splits `---` frontmatter (simple `key: value` lines) from the Markdown body. */
function parseFile(slug: string, raw: string): Insight {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Insight "${slug}.md" must start with a --- header block (see src/content/insights/README.md).`);
  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (!pair) continue;
    let value = pair[2].trim();
    if (/^".*"$/.test(value)) value = value.slice(1, -1).replace(/\\"/g, '"');
    fields[pair[1]] = value;
  }
  const parsed = frontmatterSchema.safeParse(fields);
  if (!parsed.success) {
    throw new Error(`Insight "${slug}.md": ${parsed.error.issues.map((issue) => `${String(issue.path[0])} — ${issue.message}`).join("; ")}`);
  }
  const body = match[2].trim();
  const minutes = Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
  return { slug, ...parsed.data, draft: parsed.data.draft === "true", readTime: `${minutes} min read`, body };
}

function readAll(): Insight[] {
  return readdirSync(DIRECTORY)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .map((file) => parseFile(file.replace(/\.md$/, ""), readFileSync(join(DIRECTORY, file), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Published articles, newest first: not drafts, and dated today or earlier (UTC). */
export function getInsights(): Insight[] {
  const today = new Date().toISOString().slice(0, 10);
  return readAll().filter((insight) => !insight.draft && insight.date <= today);
}

export function getInsightBySlug(slug: string) {
  return getInsights().find((insight) => insight.slug === slug);
}

/** Older and newer neighbours of an article in the published list. */
export function getAdjacentInsights(slug: string) {
  const insights = getInsights();
  const index = insights.findIndex((insight) => insight.slug === slug);
  return {
    newer: index > 0 ? insights[index - 1] : null,
    older: index >= 0 && index < insights.length - 1 ? insights[index + 1] : null,
  };
}

export function formatInsightDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
