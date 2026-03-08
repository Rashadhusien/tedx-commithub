import CreateCommitteeForm from "@/components/committees/create-committee-form";
import { PageTitle } from "@/components/ui/page-title";
import React from "react";

const CreateCommitteePage = () => {
  return (
    <div>
      <PageTitle
        title="Create Committee"
        description="Create a new committee for your organization"
      />

      <div className="max-w-2xl mx-auto">
        <CreateCommitteeForm />
      </div>
    </div>
  );
};

export default CreateCommitteePage;
