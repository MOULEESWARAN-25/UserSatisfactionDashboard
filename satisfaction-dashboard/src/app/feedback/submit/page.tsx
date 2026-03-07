"use client";

import { AppShell } from "@/components/layout/AppShell";
import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { StudentOnly } from "@/components/auth/ProtectedRoute";

export default function SubmitFeedbackPage() {
  return (
    <StudentOnly>
      <AppShell
        title="Submit Feedback"
        description="Rate a campus service and share your experience"
      >
        <FeedbackForm />
      </AppShell>
    </StudentOnly>
  );
}
