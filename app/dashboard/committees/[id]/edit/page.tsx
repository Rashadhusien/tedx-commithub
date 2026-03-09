import EditCommitteeForm from "@/components/committees/edit-committee-form";
import { PageTitle } from "@/components/ui/page-title";
import { getCommitteeById } from "@/lib/services/committees.services";
import { notFound } from "next/navigation";

interface EditCommitteePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCommitteePage({
  params,
}: EditCommitteePageProps) {
  const { id } = await params;
  const { data: committee } = await getCommitteeById(id);

  console.log(committee);

  if (!committee) {
    notFound();
  }

  return (
    <div>
      <PageTitle
        title="Edit Committee"
        description={`Update details for ${committee.name}`}
      />

      <div className="max-w-2xl mx-auto">
        <EditCommitteeForm committeeId={id} />
      </div>
    </div>
  );
}
