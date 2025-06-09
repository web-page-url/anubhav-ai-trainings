import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: any = null;

// Initialize Supabase only if credentials are available
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Types for database operations
export interface SectionProgress {
  sectionNumber: number;
  sectionTitle: string;
  totalQuestions: number;
  questionsCorrect: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  completedAt: string;
}

export interface QuestionResponse {
  sectionNumber: number;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  responseTime: number;
  timestamp: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  mobile?: string;
}

export class SectionDatabaseService {
  private static isAvailable(): boolean {
    return supabase !== null && !!supabaseUrl && !!supabaseKey;
  }

  // Save section completion to database
  static async saveSectionCompletion(
    userId: string, 
    completionData: SectionProgress
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      console.log('Database not available, using localStorage only');
      return false;
    }

    try {
      // First, get the section UUID from section number
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .select('id')
        .eq('section_number', completionData.sectionNumber)
        .single();

      if (sectionError || !sectionData) {
        console.error('Error finding section:', sectionError);
        return false;
      }

      const sectionId = sectionData.id;

      // Upsert user section progress
      const { error: progressError } = await supabase
        .from('user_section_progress')
        .upsert({
          user_id: userId,
          section_id: sectionId,
          questions_answered: completionData.totalQuestions,
          questions_correct: completionData.questionsCorrect,
          total_score: completionData.score,
          max_possible_score: completionData.totalQuestions,
          time_spent: completionData.timeSpent,
          completion_percentage: completionData.accuracy,
          status: 'completed',
          completed_at: completionData.completedAt
        }, {
          onConflict: 'user_id,section_id'
        });

      if (progressError) {
        console.error('Error saving section progress:', progressError);
        return false;
      }

      console.log('✅ Section completion saved to database');
      return true;
    } catch (error) {
      console.error('Database save error:', error);
      return false;
    }
  }

  // Save individual question response to database
  static async saveQuestionResponse(
    userId: string,
    response: QuestionResponse
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      // Get section UUID
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .select('id')
        .eq('section_number', response.sectionNumber)
        .single();

      if (sectionError || !sectionData) {
        console.error('Error finding section:', sectionError);
        return false;
      }

      const sectionId = sectionData.id;

      // Insert question response
      const { error: responseError } = await supabase
        .from('user_question_responses')
        .upsert({
          user_id: userId,
          section_id: sectionId,
          question_id: response.questionId,
          user_answer: response.answer,
          is_correct: response.isCorrect,
          response_time: response.responseTime,
          points_earned: response.isCorrect ? 1 : 0,
          created_at: response.timestamp
        }, {
          onConflict: 'user_id,question_id',
          ignoreDuplicates: true
        });

      return !responseError;
    } catch (error) {
      console.error('Database save error:', error);
      return false;
    }
  }

  // Load user's section progress from database
  static async loadUserSectionProgress(userId: string): Promise<SectionProgress[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('user_section_progress')
        .select(`
          *,
          sections (
            section_number,
            title
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (error) {
        console.error('Error loading section progress:', error);
        return [];
      }

      return data?.map((progress: any) => ({
        sectionNumber: progress.sections.section_number,
        sectionTitle: progress.sections.title,
        totalQuestions: progress.questions_answered,
        questionsCorrect: progress.questions_correct,
        score: progress.total_score,
        accuracy: progress.completion_percentage,
        timeSpent: progress.time_spent,
        completedAt: progress.completed_at
      })) || [];
    } catch (error) {
      console.error('Database load error:', error);
      return [];
    }
  }

  // Load user's question responses from database
  static async loadUserQuestionResponses(userId: string): Promise<QuestionResponse[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('user_question_responses')
        .select(`
          *,
          sections (section_number)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading question responses:', error);
        return [];
      }

      return data?.map((response: any) => ({
        sectionNumber: response.sections.section_number,
        questionId: response.question_id,
        answer: response.user_answer,
        isCorrect: response.is_correct,
        responseTime: response.response_time,
        timestamp: response.created_at
      })) || [];
    } catch (error) {
      console.error('Database load error:', error);
      return [];
    }
  }

  // Sync localStorage data to database
  static async syncLocalStorageToDatabase(userId: string): Promise<void> {
    if (!this.isAvailable()) {
      console.log('Database not available, skipping sync');
      return;
    }

    try {
      // Sync completed sections
      const completedSections = JSON.parse(localStorage.getItem('completed_sections') || '[]') as SectionProgress[];
      for (const completion of completedSections) {
        await this.saveSectionCompletion(userId, completion);
      }

      // Sync question responses
      const questionResponses = JSON.parse(localStorage.getItem('section_progress') || '[]') as QuestionResponse[];
      for (const response of questionResponses) {
        await this.saveQuestionResponse(userId, response);
      }

      console.log('✅ LocalStorage data synced to database');
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  // Load database data and merge with localStorage
  static async loadAndMergeData(userId: string): Promise<{
    completedSections: SectionProgress[];
    questionResponses: QuestionResponse[];
  }> {
    try {
      // Load from localStorage
      const localCompletions = JSON.parse(localStorage.getItem('completed_sections') || '[]') as SectionProgress[];
      const localResponses = JSON.parse(localStorage.getItem('section_progress') || '[]') as QuestionResponse[];

      if (!this.isAvailable()) {
        return {
          completedSections: localCompletions,
          questionResponses: localResponses
        };
      }

      // Load from database
      const dbCompletions = await this.loadUserSectionProgress(userId);
      const dbResponses = await this.loadUserQuestionResponses(userId);

      // Merge data (prioritize more recent entries)
      const mergedCompletions = this.mergeCompletionData(localCompletions, dbCompletions);
      const mergedResponses = this.mergeResponseData(localResponses, dbResponses);

      // Update localStorage with merged data
      localStorage.setItem('completed_sections', JSON.stringify(mergedCompletions));
      localStorage.setItem('section_progress', JSON.stringify(mergedResponses));

      return {
        completedSections: mergedCompletions,
        questionResponses: mergedResponses
      };
    } catch (error) {
      console.error('Load and merge error:', error);
      return {
        completedSections: JSON.parse(localStorage.getItem('completed_sections') || '[]'),
        questionResponses: JSON.parse(localStorage.getItem('section_progress') || '[]')
      };
    }
  }

  // Helper method to merge completion data
  private static mergeCompletionData(local: SectionProgress[], db: SectionProgress[]): SectionProgress[] {
    const merged = new Map<number, SectionProgress>();

    // Add local data
    local.forEach(completion => {
      merged.set(completion.sectionNumber, completion);
    });

    // Add/overwrite with database data if it's more recent
    db.forEach(completion => {
      const existing = merged.get(completion.sectionNumber);
      if (!existing || new Date(completion.completedAt) > new Date(existing.completedAt)) {
        merged.set(completion.sectionNumber, completion);
      }
    });

    return Array.from(merged.values());
  }

  // Helper method to merge response data
  private static mergeResponseData(local: QuestionResponse[], db: QuestionResponse[]): QuestionResponse[] {
    const merged = new Map<string, QuestionResponse>();

    // Add local data
    local.forEach(response => {
      const key = `${response.sectionNumber}-${response.questionId}`;
      merged.set(key, response);
    });

    // Add/overwrite with database data if it's more recent
    db.forEach(response => {
      const key = `${response.sectionNumber}-${response.questionId}`;
      const existing = merged.get(key);
      if (!existing || new Date(response.timestamp) > new Date(existing.timestamp)) {
        merged.set(key, response);
      }
    });

    return Array.from(merged.values());
  }

  // Check if database is available
  static async testDatabaseConnection(): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('sections')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }
} 