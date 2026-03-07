import { AppShell } from "@/components/layout/AppShell";
import { FeedbackForm } from "@/components/forms/FeedbackForm";

export default function SubmitFeedbackPage() {
  return (
    <AppShell
      title="Submit Feedback"
      description="Rate a campus service and share your experience"
    >
      <div className="max-w-xl mx-auto">
        <FeedbackForm />
      </div>
    </AppShell>
  );
}
