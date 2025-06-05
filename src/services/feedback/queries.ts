import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export const FEEDBACK_COLLECTION = 'sales_feedback';
export const ACTIVITIES_COLLECTION = 'sales_activities';

export const getFeedbackQuery = (repId: string) => 
  query(
    collection(db, FEEDBACK_COLLECTION),
    where('repId', '==', repId),
    orderBy('createdAt', 'desc')
  );

export const getActivitiesQuery = (repId: string) =>
  query(
    collection(db, ACTIVITIES_COLLECTION),
    where('repId', '==', repId)
  );