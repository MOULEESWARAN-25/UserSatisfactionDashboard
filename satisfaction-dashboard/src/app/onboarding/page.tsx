"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, Globe, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "College Information",
    description: "Tell us about your institution",
  },
  {
    id: 2,
    title: "Primary Contact",
    description: "Who will be the main administrator?",
  },
  {
    id: 3,
    title: "Configuration",
    description: "Configure initial settings",
  },
  {
    id: 4,
    title: "Complete",
    description: "You're all set!",
  },
];

export default function CollegeOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [collegeData, setCollegeData] = useState({
    name: "",
    domain: "",
    address: "",
    phone: "",
    contactEmail: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    servicesEnabled: [] as string[],
  });

  const  [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!collegeData.name.trim()) newErrors.name = "College name is required";
      if (!collegeData.domain.trim()) newErrors.domain = "Domain is required";
      if (!collegeData.contactEmail.trim()) newErrors.contactEmail = "Contact email is required";
      else if (!/\S+@\S+\.\S+/.test(collegeData.contactEmail)) {
        newErrors.contactEmail = "Invalid email format";
      }
    }

    if (step === 2) {
      if (!collegeData.adminName.trim()) newErrors.adminName = "Admin name is required";
      if (!collegeData.adminEmail.trim()) newErrors.adminEmail = "Admin email is required";
      else if (!/\S+@\S+\.\S+/.test(collegeData.adminEmail)) {
        newErrors.adminEmail = "Invalid email format";
      }
      if (!collegeData.adminPassword) newErrors.adminPassword = "Password is required";
      else if (collegeData.adminPassword.length < 8) {
        newErrors.adminPassword = "Password must be at least 8 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // In production, POST to /api/colleges/onboard
      const response = await fetch("/api/colleges/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collegeData),
      });

      if (response.ok) {
        setCurrentStep(4);
      } else {
        throw new Error("Onboarding failed");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setCollegeData((prev) => ({
      ...prev,
      servicesEnabled: prev.servicesEnabled.includes(serviceId)
        ? prev.servicesEnabled.filter((id) => id !== serviceId)
        : [...prev.servicesEnabled, serviceId],
    }));
  };

  const defaultServices = [
    { id: "library", name: "Library", icon: "📚" },
    { id: "cafeteria", name: "Cafeteria", icon: "🍽️" },
    { id: "hostel", name: "Hostel", icon: "🏠" },
    { id: "online-course", name: "Online Portal", icon: "💻" },
    { id: "campus-event", name: "Campus Events", icon: "🎉" },
    { id: "transport", name: "Transport", icon: "🚌" },
    { id: "sports", name: "Sports Facilities", icon: "⚽" },
    { id: "health", name: "Health Center", icon: "🏥" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {ONBOARDING_STEPS.map((step, idx) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep >= step.id
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  {idx < ONBOARDING_STEPS.length - 1 && (
                    <div
                      className={`h-1 flex-1 transition-colors ${
                        currentStep > step.id
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {ONBOARDING_STEPS[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {ONBOARDING_STEPS[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: College Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">College/University Name *</Label>
                      <div className="relative mt-2">
                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          placeholder="e.g., Massachusetts Institute of Technology"
                          className="pl-10"
                          value={collegeData.name}
                          onChange={(e) =>
                            setCollegeData({ ...collegeData, name: e.target.value })
                          }
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="domain">Preferred Subdomain *</Label>
                      <div className="relative mt-2">
                        <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="domain"
                          placeholder="e.g., mit"
                          className="pl-10"
                          value={collegeData.domain}
                          onChange={(e) =>
                            setCollegeData({
                              ...collegeData,
                              domain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                            })
                          }
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Your platform will be accessible at:{" "}
                        <span className="font-mono font-medium">
                          {collegeData.domain || "yourCollege"}.yourplatform.com
                        </span>
                      </p>
                      {errors.domain && (
                        <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Full address"
                        value={collegeData.address}
                        onChange={(e) =>
                          setCollegeData({ ...collegeData, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactEmail">Contact Email *</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="contactEmail"
                            type="email"
                            placeholder="info@college.edu"
                            className="pl-10"
                            value={collegeData.contactEmail}
                            onChange={(e) =>
                              setCollegeData({
                                ...collegeData,
                                contactEmail: e.target.value,
                              })
                            }
                          />
                        </div>
                        {errors.contactEmail && (
                          <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative mt-2">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="pl-10"
                            value={collegeData.phone}
                            onChange={(e) =>
                              setCollegeData({ ...collegeData, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Primary Contact */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminName">Administrator Name *</Label>
                      <Input
                        id="adminName"
                        placeholder="Full name"
                        value={collegeData.adminName}
                        onChange={(e) =>
                          setCollegeData({ ...collegeData, adminName: e.target.value })
                        }
                      />
                      {errors.adminName && (
                        <p className="mt-1 text-sm text-red-600">{errors.adminName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="adminEmail">Administrator Email *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@college.edu"
                        value={collegeData.adminEmail}
                        onChange={(e) =>
                          setCollegeData({ ...collegeData, adminEmail: e.target.value })
                        }
                      />
                      {errors.adminEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.adminEmail}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="adminPassword">Password *</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={collegeData.adminPassword}
                        onChange={(e) =>
                          setCollegeData({ ...collegeData, adminPassword: e.target.value })
                        }
                      />
                      {errors.adminPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.adminPassword}</p>
                      )}
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        This person will be the primary College Admin with full access to
                        configure services, manage users, and view analytics.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Configuration */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Select Services to Enable</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose which services you want to collect feedback for
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {defaultServices.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                            collegeData.servicesEnabled.includes(service.id)
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                          }`}
                        >
                          <span className="text-2xl">{service.icon}</span>
                          <span className="text-sm font-medium">{service.name}</span>
                          {collegeData.servicesEnabled.includes(service.id) && (
                            <CheckCircle2 className="ml-auto h-5 w-5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        You can add or remove services later from the settings panel.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Complete */}
                {currentStep === 4 && (
                  <div className="space-y-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome to the Platform!
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Your college account has been created successfully.
                      </p>
                    </div>

                    <div className="mx-auto max-w-md space-y-2 text-left">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Platform Configured</p>
                          <p className="text-sm text-gray-500">
                            {collegeData.servicesEnabled.length} services enabled
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Admin Account Created</p>
                          <p className="text-sm text-gray-500">{collegeData.adminEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Platform URL</p>
                          <p className="text-sm font-mono text-gray-500">
                            {collegeData.domain}.yourplatform.com
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => router.push("/dashboard")}
                      className="mt-6"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex items-center justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 1 || isSubmitting}
                    >
                      Back
                    </Button>

                    {currentStep < 3 ? (
                      <Button onClick={handleNext} disabled={isSubmitting}>
                        Next
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Creating Account..." : "Complete Setup"}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
