import { supabase } from '../lib/supabase';
import { Project, NewProject } from '../types/project';

export const addProject = async (project: NewProject): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        start_date: project.startDate,
        end_date: project.endDate,
        status: project.status,
        priority: project.priority,
        assigned_to: project.assignedTo,
        client: project.client,
        budget: project.budget,
        notes: project.notes
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const getProjectsByDate = async (
  startDate: Date,
  endDate: Date
): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .gte('start_date', startDate.toISOString())
      .lte('start_date', endDate.toISOString())
      .order('start_date', { ascending: true });

    if (error) throw error;

    return data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      startDate: project.start_date,
      endDate: project.end_date,
      status: project.status,
      priority: project.priority,
      assignedTo: project.assigned_to,
      client: project.client,
      budget: project.budget,
      notes: project.notes
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};