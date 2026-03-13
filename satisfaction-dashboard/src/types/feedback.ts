export type ServiceId =
  | "cafeteria"
  | "library"
  | "online-course"
  | "hostel"
  | "campus-event";

export interface Question {
  id: string;
  label: string;
  collegeId?: string; // Multi-tenant: college-specific questions
  isDefault?: boolean; // Whether this is a default question or college-specific
}

export interface Service {
  id: ServiceId;
  name: string;
  icon: string;
  questions: Question[];
  collegeId?: string; // Multi-tenant: college-specific services
  departmentId?: string;
  isActive?: boolean;
  ownerId?: string; // Reference to ServiceOwner
}

// Optional demographic context
export interface StudentDemographics {
  yearOfStudy?: "1" | "2" | "3" | "4" | "graduate";
  department?: string;
  residenceType?: "hostel" | "day_scholar" | "off_campus";
  programType?: "undergraduate" | "postgraduate" | "doctoral";
}

export interface FeedbackSubmission {
  studentId: string;
  studentName?: string;
  isAnonymous?: boolean;
  serviceId: ServiceId;
  ratings: Record<string, number>; // questionId → 1-5
  overallSatisfaction: number;
  comment?: string;
  submittedAt: string;
  
  // Multi-tenant support
  collegeId: string;
  
  // Optional demographic context
  demographics?: StudentDemographics;
  
  // Duplicate submission prevention
  submissionHash?: string; // Hash of studentId + serviceId + week
}

export interface FeedbackRecord extends FeedbackSubmission {
  _id: string;
  serviceName: string;
}
