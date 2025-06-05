import { SalesActivity } from '../../types/salesActivity';
import { SalesFeedback } from '../../types/salesFeedback';

export interface FeedbackWithActivity extends SalesFeedback {
  activity?: SalesActivity;
}

export interface FeedbackError extends Error {
  code?: string;
}