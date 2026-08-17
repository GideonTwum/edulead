import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OpportunityDetailPage(_props: Props) {
  notFound();
}
