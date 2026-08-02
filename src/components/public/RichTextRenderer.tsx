import { sanitizeHtml } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  const sanitized = sanitizeHtml(content);

  return (
    <div
      className={cn(
        "prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-navy prose-a:text-brand-navy prose-a:underline hover:prose-a:text-brand-green-dark prose-blockquote:border-brand-green prose-blockquote:text-brand-grey",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
