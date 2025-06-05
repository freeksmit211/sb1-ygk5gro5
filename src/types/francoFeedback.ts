export interface FrancoFeedback {
  id: string;
  activityId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface FrancoActivityWithFeedback extends FrancoActivity {
  feedback?: FrancoFeedback;
}