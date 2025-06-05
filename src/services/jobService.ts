import { supabase } from '../lib/supabase';
import { Job, NewJob } from '../types/job';

export const addJob = async (job: NewJob): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: job.title,
        description: job.description,
        job_date: job.jobDate,
        status: job.status,
        priority: job.priority,
        assigned_to: job.assignedTo,
        client: job.client,
        notes: job.notes,
        job_card_number: job.jobCardNumber
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

export const updateJob = async (id: string, job: Job): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .update({
        title: job.title,
        description: job.description,
        job_date: job.jobDate,
        status: job.status,
        priority: job.priority,
        assigned_to: job.assignedTo,
        client: job.client,
        notes: job.notes,
        job_card_number: job.jobCardNumber
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const getJobsByDate = async (
  startDate: Date,
  endDate: Date
): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .gte('job_date', startDate.toISOString())
      .lte('job_date', endDate.toISOString())
      .order('job_date', { ascending: true });

    if (error) throw error;

    return data.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      jobDate: job.job_date,
      status: job.status,
      priority: job.priority,
      assignedTo: job.assigned_to,
      client: job.client,
      notes: job.notes,
      jobCardNumber: job.job_card_number
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};