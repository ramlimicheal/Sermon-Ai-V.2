import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { getSermons } from '@/services/storageService';
import { SavedSermon } from '@/types';
import { BarChart3, TrendingUp, BookOpen, Calendar, Clock, Award } from 'lucide-react';

export const SermonAnalytics: React.FC = () => {
  const [sermons, setSermons] = useState<SavedSermon[]>([]);
  const [analytics, setAnalytics] = useState({
    totalSermons: 0,
    thisMonth: 0,
    avgPerMonth: 0,
    mostUsedBook: '',
    totalHoursSaved: 0,
    streak: 0
  });

  useEffect(() => {
    const allSermons = getSermons();
    setSermons(allSermons);

    // Calculate analytics
    const now = new Date();
    const thisMonth = allSermons.filter(s => {
      const sermonDate = new Date(s.createdAt);
      return sermonDate.getMonth() === now.getMonth() && 
             sermonDate.getFullYear() === now.getFullYear();
    }).length;

    // Find most used book
    const bookCounts: Record<string, number> = {};
    allSermons.forEach(s => {
      const book = s.scripture.split(' ')[0];
      bookCounts[book] = (bookCounts[book] || 0) + 1;
    });
    const mostUsedBook = Object.keys(bookCounts).reduce((a, b) => 
      bookCounts[a] > bookCounts[b] ? a : b, ''
    );

    // Calculate average per month (assuming 3 months of data)
    const avgPerMonth = Math.round(allSermons.length / 3);

    // Estimate time saved (assuming 5 hours saved per sermon)
    const totalHoursSaved = allSermons.length * 5;

    setAnalytics({
      totalSermons: allSermons.length,
      thisMonth,
      avgPerMonth,
      mostUsedBook,
      totalHoursSaved,
      streak: thisMonth
    });
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-bible-50 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-bible-900 mb-2">Sermon Analytics</h1>
          <p className="text-bible-500">Track your sermon preparation journey and productivity</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-bible-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-bible-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-bible-700" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                All Time
              </span>
            </div>
            <p className="text-4xl font-serif font-bold text-bible-900 mb-1">{analytics.totalSermons}</p>
            <p className="text-sm text-bible-500">Total Sermons</p>
          </div>

          <div className="bg-white rounded-xl border border-bible-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-700" />
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                This Month
              </span>
            </div>
            <p className="text-4xl font-serif font-bold text-bible-900 mb-1">{analytics.thisMonth}</p>
            <p className="text-sm text-bible-500">Sermons Prepared</p>
          </div>

          <div className="bg-white rounded-xl border border-bible-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-700" />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Estimated
              </span>
            </div>
            <p className="text-4xl font-serif font-bold text-bible-900 mb-1">{analytics.totalHoursSaved}</p>
            <p className="text-sm text-bible-500">Hours Saved</p>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Productivity Insights" icon={<TrendingUp className="h-5 w-5" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-bible-50 rounded-lg">
                <div>
                  <p className="text-sm text-bible-500">Average per Month</p>
                  <p className="text-2xl font-serif font-bold text-bible-900">{analytics.avgPerMonth}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-bible-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-bible-50 rounded-lg">
                <div>
                  <p className="text-sm text-bible-500">Most Preached Book</p>
                  <p className="text-2xl font-serif font-bold text-bible-900">{analytics.mostUsedBook || 'N/A'}</p>
                </div>
                <BookOpen className="h-8 w-8 text-bible-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-bible-50 rounded-lg">
                <div>
                  <p className="text-sm text-bible-500">Current Streak</p>
                  <p className="text-2xl font-serif font-bold text-bible-900">{analytics.streak} this month</p>
                </div>
                <Award className="h-8 w-8 text-bible-400" />
              </div>
            </div>
          </Card>

          <Card title="Recent Activity" icon={<Calendar className="h-5 w-5" />}>
            <div className="space-y-3">
              {sermons.slice(0, 5).map((sermon) => (
                <div key={sermon.id} className="flex items-center gap-3 p-3 bg-bible-50 rounded-lg">
                  <div className="p-2 bg-white rounded border border-bible-200">
                    <BookOpen className="h-4 w-4 text-bible-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-bible-900 text-sm truncate">{sermon.scripture}</p>
                    <p className="text-xs text-bible-500">
                      {new Date(sermon.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-bible-200 text-bible-700 px-2 py-1 rounded">
                    {sermon.language}
                  </span>
                </div>
              ))}
              {sermons.length === 0 && (
                <p className="text-center text-bible-400 py-8">No sermons yet. Start creating!</p>
              )}
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mt-6">
          <Card title="Achievements" icon={<Award className="h-5 w-5" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg text-center ${analytics.totalSermons >= 1 ? 'bg-bible-100 border-2 border-bible-300' : 'bg-bible-50 opacity-50'}`}>
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-xs font-bold text-bible-900">First Sermon</p>
                <p className="text-xs text-bible-500">Created 1 sermon</p>
              </div>

              <div className={`p-4 rounded-lg text-center ${analytics.totalSermons >= 10 ? 'bg-bible-100 border-2 border-bible-300' : 'bg-bible-50 opacity-50'}`}>
                <div className="text-3xl mb-2">📚</div>
                <p className="text-xs font-bold text-bible-900">Dedicated</p>
                <p className="text-xs text-bible-500">10 sermons prepared</p>
              </div>

              <div className={`p-4 rounded-lg text-center ${analytics.totalSermons >= 50 ? 'bg-bible-100 border-2 border-bible-300' : 'bg-bible-50 opacity-50'}`}>
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-xs font-bold text-bible-900">Master</p>
                <p className="text-xs text-bible-500">50 sermons prepared</p>
              </div>

              <div className={`p-4 rounded-lg text-center ${analytics.thisMonth >= 4 ? 'bg-bible-100 border-2 border-bible-300' : 'bg-bible-50 opacity-50'}`}>
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-xs font-bold text-bible-900">On Fire</p>
                <p className="text-xs text-bible-500">4+ sermons this month</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
