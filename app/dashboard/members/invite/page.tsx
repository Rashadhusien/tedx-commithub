import InviteMemberForm from "@/components/members/invite-member-form";
import { MemberTableWrapper } from "@/components/members/table/member-table-wrapper";
import { PageTitle } from "@/components/ui/page-title";

const Invite = () => {
  return (
    <div className="container mx-auto py-8">
      <PageTitle
        title="Invite Member"
        description="Fill in the details to invite a new member"
      />
      <div className="flex justify-center items-center">
        <InviteMemberForm />
      </div>
    </div>
  );
};

export default Invite;
