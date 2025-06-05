export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export type NewNotice = Omit<Notice, 'id' | 'createdAt' | 'createdBy'>;