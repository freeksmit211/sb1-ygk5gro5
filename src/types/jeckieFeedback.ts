export interface JeckieFeedback {
  id: string;
  activityId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface JeckieActivityWithFeedback extends JeckieActivity {
  feedback?: JeckieFeedback;
}