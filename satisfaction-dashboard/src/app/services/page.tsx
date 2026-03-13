"use client";

import { type ComponentType, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SERVICES } from "@/lib/constants";
import { MOCK_FEEDBACK } from "@/lib/mock-data";
import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  BookOpen,
  Monitor,
  Building2,
  Calendar,
  School,
  Wrench,
  Bus,
  Dumbbell,
  Microscope,
  ClipboardList,
  Stethoscope,
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  GripVertical,
} from "lucide-react";
import type { Service, ServiceId, Question } from "@/types/feedback";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  cafeteria: UtensilsCrossed,
  library: BookOpen,
  "online-course": Monitor,
  hostel: Building2,
  "campus-event": Calendar,
  medical: Stethoscope,
  transport: Bus,
  sports: Dumbbell,
  lab: Microscope,
  admin: ClipboardList,
  school: School,
  maintenance: Wrench,
};

const ICON_OPTIONS: Array<{ key: string; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: "cafeteria", label: "Cafeteria", icon: UtensilsCrossed },
  { key: "library", label: "Library", icon: BookOpen },
  { key: "online-course", label: "Online", icon: Monitor },
  { key: "hostel", label: "Hostel", icon: Building2 },
  { key: "campus-event", label: "Events", icon: Calendar },
  { key: "medical", label: "Medical", icon: Stethoscope },
  { key: "transport", label: "Transport", icon: Bus },
  { key: "sports", label: "Sports", icon: Dumbbell },
  { key: "lab", label: "Lab", icon: Microscope },
  { key: "admin", label: "Admin", icon: ClipboardList },
  { key: "school", label: "School", icon: School },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
];

const LEGACY_EMOJI_ICON_MAP: Record<string, string> = {
  "🍽️": "cafeteria",
  "📚": "library",
  "💻": "online-course",
  "🏠": "hostel",
  "🎉": "campus-event",
  "🏥": "medical",
  "🚌": "transport",
  "🏋️": "sports",
  "🔬": "lab",
  "📝": "admin",
  "🏫": "school",
  "🔧": "maintenance",
};

function resolveIconKey(icon: string, serviceId: string): string {
  if (SERVICE_ICONS[icon]) return icon;
  if (LEGACY_EMOJI_ICON_MAP[icon]) return LEGACY_EMOJI_ICON_MAP[icon];
  if (SERVICE_ICONS[serviceId]) return serviceId;
  return "school";
}

function generateId(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ── Edit modal overlay ────────────────────────────────────────────────
interface EditModalProps {
  service: Service;
  onClose: () => void;
  onSave: (updated: Service) => void;
}

function EditModal({ service, onClose, onSave }: EditModalProps) {
  const [name, setName] = useState(service.name);
  const [icon, setIcon] = useState(resolveIconKey(service.icon, service.id));
  const [questions, setQuestions] = useState<Question[]>([...service.questions]);
  const [newQ, setNewQ] = useState("");

  const addQuestion = () => {
    const trimmed = newQ.trim();
    if (!trimmed) return;
    setQuestions((prev) => [
      ...prev,
      { id: generateId(trimmed) + "_" + Date.now(), label: trimmed },
    ]);
    setNewQ("");
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, label: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, label } : q)));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ ...service, name: name.trim(), icon, questions });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl border bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Edit Service</h2>
            <p className="text-xs text-muted-foreground">Update service details and feedback questions</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 overflow-y-auto p-6" style={{ maxHeight: "70vh" }}>
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="svc-name">Service Name</Label>
            <Input
              id="svc-name"
              className="rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sports Complex"
            />
          </div>

          {/* Icon */}
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setIcon(opt.key)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                    icon === opt.key
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:bg-muted"
                  )}
                  title={opt.label}
                >
                  <opt.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Questions */}
          <div className="space-y-2">
            <Label>Feedback Questions ({questions.length})</Label>
            <div className="space-y-1.5">
              <AnimatePresence>
                {questions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {idx + 1}
                    </span>
                    <Input
                      className="h-7 flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                      value={q.label}
                      onChange={(e) => updateQuestion(q.id, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 rounded-md text-muted-foreground hover:text-destructive"
                      onClick={() => removeQuestion(q.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add new question */}
            <div className="flex gap-2 pt-1">
              <Input
                className="h-9 flex-1 rounded-xl text-sm"
                placeholder="Add a question…"
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addQuestion()}
              />
              <Button size="sm" variant="outline" className="h-9 gap-1 rounded-xl" onClick={addQuestion}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button className="gap-2 rounded-xl" onClick={handleSave}>
            <Check className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Add service modal ─────────────────────────────────────────────────
interface AddModalProps {
  onClose: () => void;
  onAdd: (service: Service) => void;
}

function AddModal({ onClose, onAdd }: AddModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("school");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQ, setNewQ] = useState("");
  const [error, setError] = useState("");

  const addQuestion = () => {
    const trimmed = newQ.trim();
    if (!trimmed) return;
    setQuestions((prev) => [
      ...prev,
      { id: generateId(trimmed) + "_" + Date.now(), label: trimmed },
    ]);
    setNewQ("");
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAdd = () => {
    if (!name.trim()) { setError("Service name is required."); return; }
    if (questions.length === 0) { setError("Add at least one feedback question."); return; }
    setError("");
    onAdd({
      id: generateId(name) as ServiceId,
      name: name.trim(),
      icon,
      questions,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl border bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">New Service</h2>
            <p className="text-xs text-muted-foreground">Define a new campus service for feedback collection</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 overflow-y-auto p-6" style={{ maxHeight: "70vh" }}>
          <div className="space-y-1.5">
            <Label htmlFor="new-svc-name">Service Name</Label>
            <Input
              id="new-svc-name"
              className="rounded-xl"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Sports Complex, Medical Center"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setIcon(opt.key)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                    icon === opt.key
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-border hover:bg-muted"
                  )}
                  title={opt.label}
                >
                  <opt.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Feedback Questions</Label>
            <p className="text-xs text-muted-foreground">Students will rate each of these on a 1–5 scale</p>
            <div className="space-y-1.5">
              <AnimatePresence>
                {questions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm">{q.label}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 rounded-md text-muted-foreground hover:text-destructive"
                      onClick={() => removeQuestion(q.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex gap-2 pt-1">
              <Input
                className="h-9 flex-1 rounded-xl text-sm"
                placeholder="e.g. Cleanliness, Staff Behavior…"
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addQuestion()}
              />
              <Button size="sm" variant="outline" className="h-9 gap-1 rounded-xl" onClick={addQuestion}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button className="gap-2 rounded-xl" onClick={handleAdd}>
            <Plus className="h-4 w-4" /> Create Service
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(SERVICES as Service[]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleSave = (updated: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingService(null);
  };

  const handleAdd = (newService: Service) => {
    setServices((prev) => [...prev, newService]);
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const getServiceFeedbackStats = (serviceId: string) => {
    const serviceFeedback = MOCK_FEEDBACK.filter((f) => f.serviceId === serviceId);
    const lastDate = serviceFeedback
      .map((f) => new Date(f.submittedAt).getTime())
      .sort((a, b) => b - a)[0];

    return {
      totalFeedback: serviceFeedback.length,
      lastFeedbackDate: lastDate
        ? new Date(lastDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No feedback yet",
    };
  };

  return (
    <AdminOnly>
      <AppShell
        title="Services"
        description="Manage campus services and their feedback questions"
      >
        <AnimatePresence>
          {editingService && (
            <EditModal
              service={editingService}
              onClose={() => setEditingService(null)}
              onSave={handleSave}
            />
          )}
          {showAdd && (
            <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Heading row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {services.length} service{services.length !== 1 ? "s" : ""} configured
              </p>
            </div>
            <Button className="gap-2 rounded-xl" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" />
              New Service
            </Button>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {services.map((service, idx) => {
                const iconKey = resolveIconKey(service.icon, service.id);
                const IconComponent = SERVICE_ICONS[iconKey] || HelpCircle;
                const stats = getServiceFeedbackStats(service.id);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                  >
                    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl transition-colors group-hover:bg-primary/15">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{service.name}</CardTitle>
                              <CardDescription>
                                {service.questions.length} question{service.questions.length !== 1 ? "s" : ""}
                              </CardDescription>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {stats.totalFeedback} feedback entries • Last: {stats.lastFeedbackDate}
                              </p>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg"
                              onClick={() => setEditingService(service)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                              onClick={() => handleDelete(service.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pt-0">
                        <div className="flex flex-wrap gap-1.5">
                          {service.questions.map((q) => (
                            <Badge
                              key={q.id}
                              variant="secondary"
                              className="rounded-full px-2.5 py-0.5 text-xs font-normal"
                            >
                              {q.label}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <div className="border-t px-5 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => setEditingService(service)}
                        >
                          <Pencil className="h-3 w-3" /> Edit questions
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </AppShell>
    </AdminOnly>
  );
}

