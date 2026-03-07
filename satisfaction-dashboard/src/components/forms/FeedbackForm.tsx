"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceSelector } from "@/components/forms/ServiceSelector";
import { RatingInput } from "@/components/forms/RatingInput";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SERVICES } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import type { ServiceId } from "@/types/feedback";
import { cn } from "@/lib/utils";

const STEPS = ["Select Service", "Rate Service", "Review & Submit"];

export function FeedbackForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceId | null>(
    null
  );
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overallSatisfaction, setOverallSatisfaction] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const service = SERVICES.find((s) => s.id === selectedService);

  const canProceedStep0 = selectedService !== null;
  const canProceedStep1 =
    service?.questions.every((q) => ratings[q.id] > 0) &&
    overallSatisfaction > 0;

  async function handleSubmit() {
    if (!selectedService || !service || !user) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user.id,
          studentName: user.name,
          serviceId: selectedService,
          serviceName: service.name,
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
      <Card className="mx-auto max-w-lg overflow-hidden">
        <CardContent className="flex flex-col items-center space-y-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Feedback Submitted</h3>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Thank you for rating {service?.name}. Your feedback helps us
              improve campus services.
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
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-6">
        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    i === step ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-12 rounded-full sm:w-16 lg:w-24",
                    i < step ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <CardTitle className="text-lg">
          {step === 0 && "Choose a Service"}
          {step === 1 && `Rate: ${service?.name}`}
          {step === 2 && "Review & Submit"}
        </CardTitle>
        <CardDescription>
          {step === 0 &&
            "Select the campus service you'd like to provide feedback for"}
          {step === 1 && "Rate each aspect from 1 (poor) to 5 (excellent)"}
          {step === 2 && "Review your ratings and add optional comments"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
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
            <div className="divide-y divide-border/50 overflow-hidden rounded-xl border">
              {service.questions.map((q) => (
                <div key={q.id} className="bg-card px-4">
                  <RatingInput
                    label={q.label}
                    value={ratings[q.id] ?? 0}
                    onChange={(v) =>
                      setRatings((r) => ({ ...r, [q.id]: v }))
                    }
                    required
                  />
                </div>
              ))}
              <div className="bg-muted/30 px-4">
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
          <div className="space-y-6">
            <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{service?.name}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Score</span>
                <span className="font-semibold">
                  {overallSatisfaction} / 5
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Questions Rated</span>
                <span className="font-medium">
                  {service?.questions.length} categories
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Comments (optional)
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share additional thoughts or suggestions..."
                className="w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < 2 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
