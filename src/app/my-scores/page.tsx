'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService } from '@/lib/supabase';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  mobile?: string;
}

interface PersonalProgress {
  sectionNumber: number;
  part: 'A' | 'B';
  step: string;
  questionsAnswered: number;
  questionsCorrect: number;
  timeSpent: number;
  completedAt?: string;
  accuracy: number;
}

interface PersonalStats {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  totalTimeSpent: number;
  completedModules: number;
  averageModuleTime: number;
  currentStreak: number;
  bestScore: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function MyScoresPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [personalProgress, setPersonalProgress] = useState<PersonalProgress[]>([]);
  const [personalStats, setPersonalStats] = useState<PersonalStats>({
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    overallAccuracy: 0,
    totalTimeSpent: 0,
    completedModules: 0,
    averageModuleTime: 0,
    currentStreak: 0,
    bestScore: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Module configuration
  const modules = [
    { section: 1, part: 'A', title: 'Web Development Overview', steps: ['warmup', 'discussion', 'quickfire'] },
    { section: 1, part: 'B', title: 'Modern Development Tools', steps: ['warmup', 'discussion', 'quickfire'] },
    { section: 2, part: 'A', title: 'React Fundamentals', steps: ['warmup', 'discussion', 'quickfire'] },
    { section: 2, part: 'B', title: 'State Management & Hooks', steps: ['warmup', 'discussion', 'quickfire'] },
    { section: 3, part: 'A', title: 'Performance Optimization', steps: ['warmup', 'discussion', 'quickfire'] },
    { section: 3, part: 'B', title: 'Testing & Deployment', steps: ['warmup', 'discussion', 'quickfire'] }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('learning_user_id');
    localStorage.removeItem('user_info');
    
    // Redirect to login page
    router.push('/login');
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user info from localStorage
      const storedUserInfo = localStorage.getItem('user_info');
      const userId = localStorage.getItem('learning_user_id');
      
      if (!storedUserInfo || !userId) {
        router.push('/register');
        return;
      }
      
      const userInfo = JSON.parse(storedUserInfo);
      setUserInfo(userInfo);
      
      // Load user's progress data
      await loadPersonalProgress(userId);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonalProgress = async (userId: string) => {
    try {
      // Simulate loading personal progress (in real implementation, this would fetch from database)
      // For now, we'll generate some realistic sample data
      const sampleProgress: PersonalProgress[] = [];
      let totalQuestions = 0;
      let totalCorrect = 0;
      let totalTime = 0;
      let completedCount = 0;
      
      modules.forEach((module, moduleIndex) => {
        module.steps.forEach((step, stepIndex) => {
          if (Math.random() > 0.3) { // 70% chance module is started/completed
            const questionsAnswered = step === 'discussion' ? 0 : Math.floor(Math.random() * 5) + 3;
            const questionsCorrect = Math.floor(questionsAnswered * (0.6 + Math.random() * 0.4));
            const timeSpent = Math.floor(Math.random() * 300) + 120; // 2-7 minutes
            const isCompleted = Math.random() > 0.2;
            
            sampleProgress.push({
              sectionNumber: module.section,
              part: module.part,
              step,
              questionsAnswered,
              questionsCorrect,
              timeSpent,
              completedAt: isCompleted ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
              accuracy: questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0
            });
            
            totalQuestions += questionsAnswered;
            totalCorrect += questionsCorrect;
            totalTime += timeSpent;
            if (isCompleted) completedCount++;
          }
        });
      });
      
      setPersonalProgress(sampleProgress);
      
      // Calculate personal stats
      const stats: PersonalStats = {
        totalQuestionsAnswered: totalQuestions,
        totalCorrectAnswers: totalCorrect,
        overallAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        totalTimeSpent: totalTime,
        completedModules: completedCount,
        averageModuleTime: completedCount > 0 ? Math.round(totalTime / completedCount) : 0,
        currentStreak: Math.floor(Math.random() * 8) + 1,
        bestScore: Math.floor(Math.random() * 30) + 70
      };
      
      setPersonalStats(stats);
      
      // Generate achievements
      generateAchievements(stats);
      
    } catch (error) {
      console.error('Error loading personal progress:', error);
    }
  };

  const generateAchievements = (stats: PersonalStats) => {
    const achievementsList: Achievement[] = [
      {
        id: 'first-module',
        title: 'Getting Started',
        description: 'Complete your first module',
        icon: '🌟',
        unlocked: stats.completedModules >= 1,
        unlockedAt: stats.completedModules >= 1 ? new Date().toISOString() : undefined
      },
      {
        id: 'accuracy-master',
        title: 'Accuracy Master',
        description: 'Achieve 80%+ overall accuracy',
        icon: '🎯',
        unlocked: stats.overallAccuracy >= 80,
        unlockedAt: stats.overallAccuracy >= 80 ? new Date().toISOString() : undefined
      },
      {
        id: 'speed-learner',
        title: 'Speed Learner',
        description: 'Complete a module in under 10 minutes',
        icon: '⚡',
        unlocked: stats.averageModuleTime < 600,
        unlockedAt: stats.averageModuleTime < 600 ? new Date().toISOString() : undefined
      },
      {
        id: 'streak-champion',
        title: 'Streak Champion',
        description: 'Maintain a 5-day learning streak',
        icon: '🔥',
        unlocked: stats.currentStreak >= 5,
        unlockedAt: stats.currentStreak >= 5 ? new Date().toISOString() : undefined
      },
      {
        id: 'halfway-hero',
        title: 'Halfway Hero',
        description: 'Complete 50% of all modules',
        icon: '🏆',
        unlocked: stats.completedModules >= 9,
        unlockedAt: stats.completedModules >= 9 ? new Date().toISOString() : undefined
      },
      {
        id: 'completion-champion',
        title: 'Completion Champion',
        description: 'Complete all learning modules',
        icon: '👑',
        unlocked: stats.completedModules >= 18,
        unlockedAt: stats.completedModules >= 18 ? new Date().toISOString() : undefined
      }
    ];
    
    setAchievements(achievementsList);
  };

  const getModuleProgress = () => {
    const moduleProgress = modules.map(module => {
      const moduleData = personalProgress.filter(p => 
        p.sectionNumber === module.section && p.part === module.part
      );
      
      const totalSteps = module.steps.length;
      const completedSteps = moduleData.filter(d => d.completedAt).length;
      const totalQuestions = moduleData.reduce((acc, d) => acc + d.questionsAnswered, 0);
      const totalCorrect = moduleData.reduce((acc, d) => acc + d.questionsCorrect, 0);
      const totalTime = moduleData.reduce((acc, d) => acc + d.timeSpent, 0);
      
      return {
        ...module,
        completion: Math.round((completedSteps / totalSteps) * 100),
        accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        timeSpent: totalTime,
        questionsAnswered: totalQuestions,
        status: completedSteps === totalSteps ? 'completed' : completedSteps > 0 ? 'in-progress' : 'not-started'
      };
    });
    
    return moduleProgress;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading Your Progress...</h2>
          <p className="text-gray-600 dark:text-gray-300">Fetching your personal learning analytics</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please register to view your personal scores</p>
          <button
            onClick={() => router.push('/register')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
    );
  }

  const moduleProgress = getModuleProgress();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                📊 My Learning Dashboard
              </h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                Personal Analytics
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{userInfo.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{userInfo.email}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                🔓 Logout
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                ← Home
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personal Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {personalStats.overallAccuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Accuracy</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {personalStats.totalCorrectAnswers}/{personalStats.totalQuestionsAnswered} correct
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {personalStats.completedModules}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              of {modules.length * 3} total steps
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {Math.round(personalStats.totalTimeSpent / 60)}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent Learning</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Avg: {Math.round(personalStats.averageModuleTime / 60)}m per module
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {personalStats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Keep it up! 🔥
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: '📈 Progress Overview', desc: 'Your learning journey' },
            { id: 'modules', label: '📚 Module Breakdown', desc: 'Detailed module stats' },
            { id: 'achievements', label: '🏆 Achievements', desc: 'Unlocked badges' },
            { id: 'comparison', label: '📊 Compare', desc: 'vs. Other learners' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div>{tab.label}</div>
              <div className="text-xs opacity-70">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📈 Your Learning Progress
              </h2>
              
              {/* Progress Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Overall Course Progress
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Course Completion</span>
                    <span>{Math.round((personalStats.completedModules / (modules.length * 3)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((personalStats.completedModules / (modules.length * 3)) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {personalStats.totalQuestionsAnswered}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Questions Answered</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {personalStats.bestScore}%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">Best Module Score</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {achievements.filter(a => a.unlocked).length}
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Achievements Unlocked</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {personalProgress
                    .filter(p => p.completedAt)
                    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                    .slice(0, 5)
                    .map((progress, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            ✓
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Section {progress.sectionNumber} - Part {progress.part} ({progress.step})
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {progress.accuracy}% accuracy • {Math.round(progress.timeSpent / 60)} minutes
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(progress.completedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📚 Module Breakdown
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moduleProgress.map((module, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Section {module.section} - Part {module.part}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        module.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : module.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {module.title}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{module.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${module.completion}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Accuracy</span>
                          <div className="font-semibold text-gray-900 dark:text-white">{module.accuracy}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Time</span>
                          <div className="font-semibold text-gray-900 dark:text-white">{Math.round(module.timeSpent / 60)}m</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {module.questionsAnswered} questions answered
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🏆 Your Achievements
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-6 rounded-lg shadow-sm border-2 transition-all duration-200 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-semibold mb-2 ${
                        achievement.unlocked 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        achievement.unlocked 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                      {!achievement.unlocked && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          🔒 Locked
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📊 Performance Comparison
              </h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  How You Compare to Other Learners
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Accuracy Ranking</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center">
                          <span className="text-yellow-600 dark:text-yellow-400 font-semibold mr-3">👤 You</span>
                          <span className="text-gray-900 dark:text-white">{personalStats.overallAccuracy}% accuracy</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Top 25%</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Platform average: 78% • You're performing {personalStats.overallAccuracy >= 78 ? 'above' : 'below'} average!
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Speed Ranking</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold mr-3">👤 You</span>
                          <span className="text-gray-900 dark:text-white">{Math.round(personalStats.averageModuleTime / 60)}m avg</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Top 40%</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Platform average: 8.5 minutes • You're learning at a great pace!
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    🎯 Your Learning Profile
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Based on your performance, you're a <strong>Strategic Learner</strong> - 
                    you balance accuracy and speed effectively. Keep up the excellent work!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <a
            href="/learning"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🚀 Continue Learning
          </a>
          <a
            href="/user-data"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            👥 View All Users
          </a>
        </div>
      </div>
    </div>
  );
} 