import { PageHeader } from "@/components/admin/PageHeader";
import { MessagesTable } from "@/components/admin/MessagesTable";
import { getContactMessages } from "@/lib/actions/admin/messages";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return (
    <div>
      <PageHeader title="Contact Messages" description="View and respond to enquiries from the public site" />
      <MessagesTable messages={messages} />
    </div>
  );
}
