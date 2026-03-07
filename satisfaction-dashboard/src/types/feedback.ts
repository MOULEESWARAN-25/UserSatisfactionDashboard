export type ServiceId =
  | "cafeteria"
  | "library"
  | "online-course"
  | "hostel"
  | "campus-event";

export interface Question {
  id: string;
  label: string;
}

export interface Service {
  id: ServiceId;
  name: string;
  icon: string;
  questions: Question[];
}

export interface FeedbackSubmission {
  studentId: string;
  studentName?: string;
  serviceId: ServiceId;
  ratings: Record<string, number>; // questionId → 1-5
  overallSatisfaction: number;
  comment?: string;
  submittedAt: string;
}

export interface FeedbackRecord extends FeedbackSubmission {
  _id: string;
  serviceName: string;
}
