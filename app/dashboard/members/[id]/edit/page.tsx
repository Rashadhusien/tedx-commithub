import EditMemberForm from "@/components/members/edit-member-form";
import { PageTitle } from "@/components/ui/page-title";
import { getMemberById } from "@/lib/services/member.services";
import { notFound } from "next/navigation";

interface EditMemberPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params;
  const { data: member } = await getMemberById(id);

  console.log(member);

  if (!member) {
    notFound();
  }

  return (
    <div>
      <PageTitle
        title="Edit Member"
        description={`Update details for ${member.name}`}
      />

      <div className="max-w-2xl mx-auto">
        <EditMemberForm memberId={id} />
      </div>
    </div>
  );
}
