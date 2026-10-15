import type { ReactNode } from "react";

/**
 * A small Markdown renderer for insight articles: headings (## / ###),
 * paragraphs, bullet and numbered lists, quotes, images on their own line,
 * **bold**, _italic_, `code` and [links](url). Output is React elements, never
 * raw HTML, so article text can't inject markup.
 */

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

function inline(text: string, keyPrefix: string): ReactNode[] {
  // Underscore emphasis only at word edges, so names like snake_case stay intact.
  const pattern = /(\*\*([^*]+)\*\*|(?<!\w)__([^_]+)__(?!\w)|\*([^*]+)\*|(?<!\w)_([^_]+)_(?!\w)|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index++}`;
    const [, , strong, strong2, em, em2, code, linkText, url] = match;
    if (strong || strong2) nodes.push(<strong key={key} className="font-semibold text-fog">{inline(strong ?? strong2, key)}</strong>);
    else if (em || em2) nodes.push(<em key={key}>{inline(em ?? em2, key)}</em>);
    else if (code) nodes.push(<code key={key} className="rounded bg-line px-1.5 py-0.5 font-mono text-[0.9em] text-fog">{code}</code>);
    else if (linkText && url && SAFE_URL.test(url)) {
      const external = /^https?:\/\//i.test(url);
      nodes.push(
        <a
          key={key}
          href={url}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-accent underline decoration-purple/50 underline-offset-4 hover:text-fog"
        >
          {inline(linkText, key)}
        </a>,
      );
    } else nodes.push(match[0]);
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="space-y-6 text-lg leading-loose text-mist">
      {blocks.map((block, index) => {
        const key = `b${index}`;
        const lines = block.split("\n");
        const heading = block.match(/^(#{2,3})\s+(.+)$/);
        if (heading && lines.length === 1) {
          return heading[1] === "##" ? (
            <h2 key={key} className="pt-6 text-2xl font-bold tracking-tight text-fog sm:text-3xl">{inline(heading[2], key)}</h2>
          ) : (
            <h3 key={key} className="pt-4 text-xl font-semibold tracking-tight text-fog">{inline(heading[2], key)}</h3>
          );
        }
        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={key} className="list-disc space-y-2 pl-6 marker:text-accent">
              {lines.map((line, i) => <li key={i}>{inline(line.replace(/^[-*]\s+/, ""), `${key}-${i}`)}</li>)}
            </ul>
          );
        }
        if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
          return (
            <ol key={key} className="list-decimal space-y-2 pl-6 marker:text-accent">
              {lines.map((line, i) => <li key={i}>{inline(line.replace(/^\d+[.)]\s+/, ""), `${key}-${i}`)}</li>)}
            </ol>
          );
        }
        if (lines.every((line) => line.startsWith(">"))) {
          return (
            <blockquote key={key} className="border-l-2 border-purple pl-5 text-fog italic">
              {inline(lines.map((line) => line.replace(/^>\s?/, "")).join(" "), key)}
            </blockquote>
          );
        }
        const image = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
        if (image && SAFE_URL.test(image[2])) {
          return (
            <figure key={key}>
              {/* eslint-disable-next-line @next/next/no-img-element -- article images are author-supplied paths of unknown size */}
              <img src={image[2]} alt={image[1]} loading="lazy" className="w-full rounded-xl border border-line" />
              {image[1] ? <figcaption className="mt-2 text-sm text-mist/80">{image[1]}</figcaption> : null}
            </figure>
          );
        }
        return <p key={key}>{inline(lines.join(" "), key)}</p>;
      })}
    </div>
  );
}
