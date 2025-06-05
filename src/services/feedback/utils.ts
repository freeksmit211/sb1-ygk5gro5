import { Timestamp, DocumentData } from 'firebase/firestore';
import { SalesActivity } from '../../types/salesActivity';
import { SalesFeedback } from '../../types/salesFeedback';

export const formatFeedbackData = (doc: DocumentData): SalesFeedback => ({
  id: doc.id,
  ...doc.data(),
  createdAt: doc.data().createdAt instanceof Timestamp 
    ? doc.data().createdAt.toDate().toISOString()
    : doc.data().createdAt,
  updatedAt: doc.data().updatedAt instanceof Timestamp
    ? doc.data().updatedAt.toDate().toISOString()
    : doc.data().updatedAt
});

export const formatActivityData = (doc: DocumentData): SalesActivity => ({
  id: doc.id,
  ...doc.data(),
  date: doc.data().date instanceof Timestamp 
    ? doc.data().date.toDate().toISOString()
    : doc.data().date
});