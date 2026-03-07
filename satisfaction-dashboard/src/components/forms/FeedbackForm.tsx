"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceSelector } from "@/components/forms/ServiceSelector";
import { RatingInput } from "@/components/forms/RatingInput";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SERVICES } from "@/lib/constants";
import type { ServiceId } from "@/types/feedback";
import { cn } from "@/lib/utils";

const STEPS = ["Select Service", "Rate Service", "Submit"];

export function FeedbackForm() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overallSatisfaction, setOverallSatisfaction] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const service = SERVICES.find((s) => s.id === selectedService);

  const canProceedStep0 = selectedService !== null;
  const canProceedStep1 =
    service?.questions.every((q) => ratings[q.id] > 0) && overallSatisfaction > 0;

  async function handleSubmit() {
    if (!selectedService || !service) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "student_demo",
          serviceId: selectedService,
          ratings,
          overallSatisfaction,
          comment: comment.trim() || undefined,
          submittedAt: new Date().toISOString(),
        }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-lg mx-auto text-center">
        <CardContent className="py-12 space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Feedback Submitted!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Thank you for rating {service?.name}. Your feedback helps improve campus services.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setSelectedService(null);
              setRatings({});
              setOverallSatisfaction(0);
              setComment("");
            }}
          >
            Submit Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader className="pb-4">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                i < step ? "bg-primary text-primary-foreground" :
                i === step ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                "bg-muted text-muted-foreground"
              )}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-px",
                  i < step ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>

        <CardTitle className="text-base">
          {step === 0 && "Choose a Service"}
          {step === 1 && `Rate: ${service?.name}`}
          {step === 2 && "Review & Submit"}
        </CardTitle>
        <CardDescription>
          {step === 0 && "Select the campus service you'd like to provide feedback for"}
          {step === 1 && "Rate each aspect from 1 (poor) to 5 (excellent)"}
          {step === 2 && "Add optional comments and submit your feedback"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Step 0 */}
        {step === 0 && (
          <ServiceSelector
            selected={selectedService}
            onChange={setSelectedService}
          />
        )}

        {/* Step 1 */}
        {step === 1 && service && (
          <div className="space-y-1">
            <div className="divide-y divide-border rounded-lg border overflow-hidden">
              {service.questions.map((q) => (
                <div key={q.id} className="px-4 bg-card">
                  <RatingInput
                    label={q.label}
                    value={ratings[q.id] ?? 0}
                    onChange={(v) => setRatings((r) => ({ ...r, [q.id]: v }))}
                    required
                  />
                </div>
              ))}
              <div className="px-4 bg-muted/30">
                <RatingInput
                  label="Overall Satisfaction"
                  value={overallSatisfaction}
                  onChange={setOverallSatisfaction}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{service?.icon} {service?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Score</span>
                <span className="font-semibold">{overallSatisfaction} / 5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Questions Rated</span>
                <span className="font-medium">{service?.questions.length} categories</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Comments (optional)</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share additional thoughts or suggestions..."
                className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}

        <Separator />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-1.5"
          >
            <ArrowLeft size={14} /> Back
          </Button>

          {step < 2 ? (
            <Button
              size="sm"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
              className="gap-1.5"
            >
              Continue <ArrowRight size={14} />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loading}
              className="gap-1.5"
            >
              <Send size={14} />
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
