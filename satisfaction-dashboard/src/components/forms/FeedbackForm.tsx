"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Send,
  Shield,
  Megaphone,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceSelector } from "@/components/forms/ServiceSelector";
import { RatingInput } from "@/components/forms/RatingInput";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { SERVICES } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import type { ServiceId } from "@/types/feedback";
import { motion, AnimatePresence } from "framer-motion";

export function FeedbackForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overallSatisfaction, setOverallSatisfaction] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const service = SERVICES.find((s) => s.id === selectedService);

  const ratedQuestions = service
    ? service.questions.filter((q) => (ratings[q.id] ?? 0) > 0).length
    : 0;
  const totalQuestions = service ? service.questions.length : 0;
  
  const isValid = selectedService !== null && 
                  ratedQuestions === totalQuestions && 
                  overallSatisfaction > 0;

  async function handleSubmit() {
    if (!isValid || !service || !user) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: isAnonymous ? "anonymous" : user.id,
          studentName: isAnonymous ? "Anonymous" : user.name,
          isAnonymous,
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
      <Card className="mx-auto max-w-lg overflow-hidden border-2 border-emerald-500/20">
        <CardContent className="flex flex-col items-center space-y-6 py-16 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Feedback Submitted!</h3>
            <p className="mx-auto max-w-sm text-muted-foreground">
              Thank you for rating {service?.name}. Your voice goes straight to the campus administration desk.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <Button
              variant="default"
              className="gap-2 bg-primary"
              onClick={() => router.push('/impact')}
            >
              <Megaphone className="h-4 w-4" />
              See Your Impact
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setSelectedService(null);
                setRatings({});
                setOverallSatisfaction(0);
                setComment("");
                setIsAnonymous(false);
              }}
            >
              Submit Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* 1. SELECTION */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">1. Which service are you rating?</h2>
          <p className="text-sm text-muted-foreground">Select a campus facility or department below.</p>
        </div>
        <ServiceSelector
          selected={selectedService}
          onChange={setSelectedService}
        />
      </div>

      <AnimatePresence>
        {service && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-8"
          >
            {/* 2. RATING */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">2. How was your experience with {service.name}?</h2>
                <p className="text-sm text-muted-foreground">Tap the stars to rate.</p>
              </div>
              
              <div className="divide-y divide-border/50 overflow-hidden rounded-xl border bg-card">
                {service.questions.map((q) => (
                  <div key={q.id} className="p-4 sm:px-6">
                    <RatingInput
                      label={q.label}
                      value={ratings[q.id] ?? 0}
                      onChange={(v) => setRatings((r) => ({ ...r, [q.id]: v }))}
                      required
                    />
                  </div>
                ))}
                <div className="bg-muted/30 p-4 sm:px-6">
                  <RatingInput
                    label="Overall Satisfaction"
                    value={overallSatisfaction}
                    onChange={setOverallSatisfaction}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3. DETAILS & SUBMIT */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">3. Any extra thoughts? (Optional)</h2>
              </div>
              
              <div className="space-y-4">
                <Textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us exactly what went right or wrong..."
                  className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />

                <div className="rounded-xl border bg-muted/20 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <Checkbox
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        <Shield className="h-4 w-4 text-primary" />
                        Submit completely anonymously
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your identity will be hidden from administrators.
                      </p>
                    </div>
                  </label>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2 text-base font-semibold shadow-sm"
                  onClick={handleSubmit}
                  disabled={loading || !isValid}
                >
                  <Send className="h-5 w-5" />
                  {loading ? "Submitting..." : "Submit Feedback"}
                </Button>
                
                {!isValid && (
                  <p className="text-center text-xs text-muted-foreground">
                    Please complete all ratings above to submit.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
