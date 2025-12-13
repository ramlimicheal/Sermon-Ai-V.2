import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ScheduledSermon {
  id: string;
  date: string;
  scripture: string;
  title?: string;
}

interface CalendarIntegrationProps {
  scheduledSermons: ScheduledSermon[];
  onScheduleSermon: (date: string, scripture: string, title?: string) => void;
  onRemoveSchedule: (id: string) => void;
}

export const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  scheduledSermons,
  onScheduleSermon,
  onRemoveSchedule,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scripture, setScripture] = useState('');
  const [title, setTitle] = useState('');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleSchedule = () => {
    if (!selectedDate || !scripture.trim()) {
      return;
    }
    onScheduleSermon(selectedDate, scripture, title);
    setScripture('');
    setTitle('');
    setSelectedDate(null);
  };

  const getSermonForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    return scheduledSermons.find(s => s.date === dateStr);
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Calendar className="h-3.5 w-3.5" />
        Schedule
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-bible-200 flex items-center justify-between">
              <h3 className="font-semibold text-bible-900">Preaching Schedule</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-bible-500 hover:text-bible-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 grid grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-bible-100 rounded"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h4 className="font-semibold text-bible-900">{monthName}</h4>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-bible-100 rounded"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-bible-600 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, idx) => {
                    const sermon = day ? getSermonForDate(day) : null;
                    const isSelected = selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    return (
                      <button
                        key={idx}
                        onClick={() => day && handleDateClick(day)}
                        className={`aspect-square text-xs rounded flex items-center justify-center transition-colors ${
                          !day
                            ? 'text-bible-200'
                            : isSelected
                            ? 'bg-bible-900 text-white font-semibold'
                            : sermon
                            ? 'bg-green-100 text-green-900 font-semibold hover:bg-green-200'
                            : 'bg-bible-50 text-bible-900 hover:bg-bible-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule Form */}
              <div className="space-y-4">
                {selectedDate && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-bible-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-bible-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bible-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-bible-700 mb-1">
                        Scripture Reference
                      </label>
                      <input
                        type="text"
                        value={scripture}
                        onChange={(e) => setScripture(e.target.value)}
                        placeholder="e.g., John 3:16"
                        className="w-full px-3 py-2 border border-bible-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bible-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-bible-700 mb-1">
                        Sermon Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., God's Love for the World"
                        className="w-full px-3 py-2 border border-bible-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bible-900"
                      />
                    </div>

                    <Button
                      onClick={handleSchedule}
                      className="w-full"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Schedule Sermon
                    </Button>
                  </>
                )}

                {/* Upcoming Sermons */}
                <div className="border-t border-bible-200 pt-4">
                  <h4 className="text-sm font-medium text-bible-700 mb-2">Upcoming Sermons</h4>
                  {scheduledSermons.length === 0 ? (
                    <p className="text-sm text-bible-500">No scheduled sermons</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {scheduledSermons
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(sermon => (
                          <div key={sermon.id} className="flex items-center justify-between p-2 bg-bible-50 rounded">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-bible-900">
                                {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                              <p className="text-xs text-bible-600">{sermon.scripture}</p>
                            </div>
                            <button
                              onClick={() => onRemoveSchedule(sermon.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <X className="h-3.5 w-3.5 text-red-600" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-bible-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
