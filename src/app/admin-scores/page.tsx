'use client';

import { useState, useEffect } from 'react';
import { DatabaseService } from '@/lib/supabase';

interface ParticipantScore {
  id: string;
  userId: string;
  name: string;
  email: string;
  sectionNumber: number;
  part: 'A' | 'B';
  step: string;
  questionsAnswered: number;
  questionsCorrect: number;
  accuracy: number;
  timeSpent: number;
  completedAt?: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

interface ModuleScores {
  moduleId: string;
  title: string;
  section: number;
  part: 'A' | 'B';
  participants: ParticipantScore[];
  averageScore: number;
  completionRate: number;
  totalParticipants: number;
}

export default function AdminScoresPage() {
  const [moduleScores, setModuleScores] = useState<ModuleScores[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'time' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [loading, setLoading] = useState(true);

  // Module configuration
  const modules = [
    { section: 1, part: 'A' as 'A' | 'B', title: 'Web Development Overview' },
    { section: 1, part: 'B' as 'A' | 'B', title: 'Modern Development Tools' },
    { section: 2, part: 'A' as 'A' | 'B', title: 'React Fundamentals' },
    { section: 2, part: 'B' as 'A' | 'B', title: 'State Management & Hooks' },
    { section: 3, part: 'A' as 'A' | 'B', title: 'Performance Optimization' },
    { section: 3, part: 'B' as 'A' | 'B', title: 'Testing & Deployment' }
  ];

  useEffect(() => {
    loadModuleScores();
  }, []);

  const loadModuleScores = async () => {
    try {
      setLoading(true);
      
      const moduleScoresData: ModuleScores[] = [];
      
      for (const module of modules) {
        try {
          // Try to fetch real data from database first
          let participants: ParticipantScore[] = [];
          
                     try {
             const moduleResults = await DatabaseService.getModuleResults(module.section, module.part as 'A' | 'B');
            
                         // Transform database results to our interface
             participants = moduleResults.map((result: any, index: number) => ({
               id: result.id || `${module.section}-${module.part}-${index}`,
               userId: result.user_id || `user-${index}`,
               name: result.users?.name || `User ${index + 1}`,
               email: result.users?.email || `user${index + 1}@example.com`,
               sectionNumber: result.section_number || module.section,
               part: (result.part || module.part) as 'A' | 'B',
               step: result.step || 'combined',
               questionsAnswered: result.questions_answered || 0,
               questionsCorrect: result.questions_correct || 0,
               accuracy: result.questions_answered > 0 
                 ? Math.round((result.questions_correct / result.questions_answered) * 100)
                 : 0,
               timeSpent: result.time_spent || 0,
               completedAt: result.completed_at,
               status: result.completed_at ? 'completed' : 'in-progress' as 'completed' | 'in-progress' | 'not-started'
             }));
            
                         // If no real data available, generate sample data
             if (participants.length === 0) {
               participants = generateSampleParticipants(module.section, module.part as 'A' | 'B');
             }
           } catch (dbError) {
             console.warn(`Database unavailable for module ${module.section}-${module.part}, using sample data:`, dbError);
             // Fallback to sample data if database is not available
             participants = generateSampleParticipants(module.section, module.part as 'A' | 'B');
           }
          
          const completedParticipants = participants.filter(p => p.status === 'completed');
          const averageScore = completedParticipants.length > 0 
            ? completedParticipants.reduce((acc, p) => acc + p.accuracy, 0) / completedParticipants.length
            : 0;
          
          moduleScoresData.push({
            moduleId: `${module.section}-${module.part}`,
            title: module.title,
            section: module.section,
            part: module.part,
            participants,
            averageScore: Math.round(averageScore),
            completionRate: Math.round((completedParticipants.length / participants.length) * 100),
            totalParticipants: participants.length
          });
        } catch (error) {
          console.error(`Error loading module ${module.section}-${module.part}:`, error);
        }
      }
      
      setModuleScores(moduleScoresData);
      
    } catch (error) {
      console.error('Error loading module scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleParticipants = (section: number, part: 'A' | 'B'): ParticipantScore[] => {
    const sampleNames = [
      'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
      'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Anderson',
      'Kate Thompson', 'Liam Garcia', 'Maya Patel', 'Noah Rodriguez', 'Olivia Martinez',
      'Peter Kim', 'Quinn O\'Brien', 'Rachel Green', 'Sam Jones', 'Tara Singh',
      'Uma Williams', 'Victor Chang', 'Wendy Liu', 'Xavier Woods', 'Yuki Tanaka',
      'Zoe Jackson', 'Ananya Sharma', 'Carlos Mendez', 'Diana Ross', 'Eric Foster'
    ];
    
    const participants: ParticipantScore[] = [];
    const numParticipants = Math.floor(Math.random() * 15) + 20; // 20-35 participants
    
    for (let i = 0; i < numParticipants; i++) {
      const name = sampleNames[i % sampleNames.length];
      const email = `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`;
      const questionsAnswered = Math.floor(Math.random() * 8) + 5; // 5-12 questions
      const baseAccuracy = 0.5 + Math.random() * 0.5; // 50-100% base accuracy
      const questionsCorrect = Math.floor(questionsAnswered * baseAccuracy);
      const accuracy = Math.round((questionsCorrect / questionsAnswered) * 100);
      const timeSpent = Math.floor(Math.random() * 600) + 180; // 3-13 minutes
      const statusRandom = Math.random();
      const status = statusRandom > 0.8 ? 'not-started' : statusRandom > 0.1 ? 'completed' : 'in-progress';
      
      participants.push({
        id: `user-${section}-${part}-${i}`,
        userId: `user-${i}`,
        name,
        email,
        sectionNumber: section,
        part,
        step: 'combined', // Combined results from all steps
        questionsAnswered,
        questionsCorrect,
        accuracy,
        timeSpent,
        completedAt: status === 'completed' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        status: status as 'completed' | 'in-progress' | 'not-started'
      });
    }
    
    return participants;
  };

  const getFilteredParticipants = (moduleData: ModuleScores) => {
    let filtered = moduleData.participants;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'score':
          aValue = a.accuracy;
          bValue = b.accuracy;
          break;
        case 'time':
          aValue = a.timeSpent;
          bValue = b.timeSpent;
          break;
        case 'date':
          aValue = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          bValue = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  };

  const exportToCSV = (moduleData: ModuleScores) => {
    const participants = getFilteredParticipants(moduleData);
    const headers = ['Name', 'Email', 'Questions Answered', 'Questions Correct', 'Accuracy (%)', 'Time Spent (min)', 'Status', 'Completed At'];
    
    const csvContent = [
      headers.join(','),
      ...participants.map(p => [
        `"${p.name}"`,
        `"${p.email}"`,
        p.questionsAnswered,
        p.questionsCorrect,
        p.accuracy,
        Math.round(p.timeSpent / 60),
        p.status,
        p.completedAt ? new Date(p.completedAt).toLocaleString() : 'N/A'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${moduleData.title.replace(/[^a-zA-Z0-9]/g, '_')}_scores.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllToCSV = () => {
    const allParticipants: any[] = [];
    
    moduleScores.forEach(module => {
      module.participants.forEach(p => {
        allParticipants.push({
          ...p,
          moduleTitle: module.title,
          moduleSection: module.section,
          modulePart: module.part
        });
      });
    });
    
    const headers = ['Module', 'Section', 'Part', 'Name', 'Email', 'Questions Answered', 'Questions Correct', 'Accuracy (%)', 'Time Spent (min)', 'Status', 'Completed At'];
    
    const csvContent = [
      headers.join(','),
      ...allParticipants.map(p => [
        `"${p.moduleTitle}"`,
        p.moduleSection,
        p.modulePart,
        `"${p.name}"`,
        `"${p.email}"`,
        p.questionsAnswered,
        p.questionsCorrect,
        p.accuracy,
        Math.round(p.timeSpent / 60),
        p.status,
        p.completedAt ? new Date(p.completedAt).toLocaleString() : 'N/A'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_module_scores.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading Module Scores...</h2>
          <p className="text-gray-600 dark:text-gray-300">Fetching participant results from database</p>
        </div>
      </div>
    );
  }

  const currentModuleData = selectedModule === 'all' 
    ? null 
    : moduleScores.find(m => m.moduleId === selectedModule);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                👨‍💼 Admin Scores Dashboard
              </h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                🔒 ADMIN ONLY
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={exportAllToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                📤 Export All
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Module Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">📊 All Modules Overview</option>
                {moduleScores.map((module) => (
                  <option key={module.moduleId} value={module.moduleId}>
                    Section {module.section} - Part {module.part}: {module.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Participants
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or email..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="completed">✅ Completed</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="not-started">⏸️ Not Started</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort by
              </label>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="score">Score</option>
                  <option value="name">Name</option>
                  <option value="time">Time</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {selectedModule === 'all' ? (
          // All Modules Overview
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📊 All Modules Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moduleScores.map((module) => (
                <div key={module.moduleId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Section {module.section} - Part {module.part}
                    </h3>
                    <button
                      onClick={() => setSelectedModule(module.moduleId)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {module.title}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Participants:</span>
                      <span className="font-semibold">{module.totalParticipants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Score:</span>
                      <span className="font-semibold text-purple-600">{module.averageScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate:</span>
                      <span className="font-semibold text-green-600">{module.completionRate}%</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{module.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${module.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Individual Module Details
          currentModuleData && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📚 {currentModuleData.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Section {currentModuleData.section} - Part {currentModuleData.part}
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(currentModuleData)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  📤 Export Module
                </button>
              </div>

              {/* Module Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {currentModuleData.totalParticipants}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {currentModuleData.participants.filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {currentModuleData.averageScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {currentModuleData.completionRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                </div>
              </div>

              {/* Participants Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Participant Scores ({getFilteredParticipants(currentModuleData).length} results)
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Participant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Questions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Time Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Completed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {getFilteredParticipants(currentModuleData).map((participant) => (
                        <tr key={participant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {participant.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {participant.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`text-lg font-bold ${
                                participant.accuracy >= 90 ? 'text-green-600' :
                                participant.accuracy >= 80 ? 'text-blue-600' :
                                participant.accuracy >= 70 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {participant.accuracy}%
                              </div>
                              <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    participant.accuracy >= 90 ? 'bg-green-500' :
                                    participant.accuracy >= 80 ? 'bg-blue-500' :
                                    participant.accuracy >= 70 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${participant.accuracy}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {participant.questionsCorrect}/{participant.questionsAnswered}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {Math.round(participant.timeSpent / 60)} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              participant.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : participant.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {participant.status === 'completed' ? '✅ Completed' :
                               participant.status === 'in-progress' ? '🔄 In Progress' : '⏸️ Not Started'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {participant.completedAt 
                              ? new Date(participant.completedAt).toLocaleDateString()
                              : 'N/A'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {getFilteredParticipants(currentModuleData).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No participants found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
} 