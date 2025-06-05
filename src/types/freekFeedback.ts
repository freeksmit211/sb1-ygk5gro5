export interface FreekFeedback {
  id: string;
  activityId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreekActivityWithFeedback extends FreekActivity {
  feedback?: FreekFeedback;
}