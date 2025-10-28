import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, Calendar, TrendingUp, Target, Flame, Award, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const TaskFlow = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('tasks');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    try {
      const stored = localStorage.getItem('taskflow_tasks');
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('taskflow_tasks', JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      title: newTask,
      date: selectedDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    saveTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    const updated = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter(task => task.id !== id));
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => task.date === selectedDate);
    
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter !== 'all') {
      filtered = filtered.filter(task => task.priority === filter);
    }
    
    return filtered;
  };

  const getAnalytics = () => {
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyData = last7Days.map(date => {
      const dayTasks = tasks.filter(t => t.date === date);
      const completed = dayTasks.filter(t => t.completed).length;
      return {
        date: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
        completed,
        total: dayTasks.length,
        rate: dayTasks.length ? Math.round((completed / dayTasks.length) * 100) : 0
      };
    });

    const priorityData = ['high', 'medium', 'low'].map(p => ({
      name: p.charAt(0).toUpperCase() + p.slice(1),
      value: tasks.filter(t => t.priority === p).length,
      completed: tasks.filter(t => t.priority === p && t.completed).length
    }));

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const streak = calculateStreak();

    return { dailyData, priorityData, totalTasks, completedTasks, completionRate, streak };
  };

  const calculateStreak = () => {
    const dates = [...new Set(tasks.map(t => t.date))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const dayTasks = tasks.filter(t => t.date === date);
      const allCompleted = dayTasks.length > 0 && dayTasks.every(t => t.completed);
      
      if (allCompleted) {
        streak++;
      } else if (date < today) {
        break;
      }
    }
    
    return streak;
  };

  const priorityColors = {
    high: 'from-red-500 to-pink-500',
    medium: 'from-amber-500 to-orange-500',
    low: 'from-blue-500 to-cyan-500'
  };

  const priorityBorders = {
    high: 'border-red-500',
    medium: 'border-amber-500',
    low: 'border-blue-500'
  };

  const filteredTasks = getFilteredTasks();
  const analytics = getAnalytics();

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200">
              TaskFlow
            </h1>
          </div>
          <p className="text-purple-200 text-lg">Master your day, one task at a time</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 inline-flex gap-2">
            <button
              onClick={() => setView('tasks')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                view === 'tasks'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Tasks
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                view === 'analytics'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {view === 'tasks' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-6 border border-purple-400/30 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium mb-1">Total Tasks</p>
                    <p className="text-4xl font-bold text-white">{analytics.totalTasks}</p>
                  </div>
                  <div className="p-4 bg-purple-500/30 rounded-2xl">
                    <Target className="w-8 h-8 text-purple-200" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-6 border border-pink-400/30 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-200 text-sm font-medium mb-1">Completed</p>
                    <p className="text-4xl font-bold text-white">{analytics.completionRate}%</p>
                  </div>
                  <div className="p-4 bg-pink-500/30 rounded-2xl">
                    <Award className="w-8 h-8 text-pink-200" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-3xl p-6 border border-orange-400/30 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-200 text-sm font-medium mb-1">Current Streak</p>
                    <p className="text-4xl font-bold text-white">{analytics.streak} days</p>
                  </div>
                  <div className="p-4 bg-orange-500/30 rounded-2xl">
                    <Flame className="w-8 h-8 text-orange-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="What needs to be done today?"
                  className="flex-1 px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-all"
                />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-400 transition-all"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-400 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={addTask}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:scale-105 transition-all shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
              {['all', 'pending', 'completed', 'high', 'medium', 'low'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
                  <Target className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                  <p className="text-purple-200 text-xl">No tasks for this day yet</p>
                  <p className="text-purple-300 text-sm mt-2">Add a task to get started!</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-l-4 ${priorityBorders[task.priority]} border border-white/20 shadow-lg hover:scale-[1.02] transition-all ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0 hover:scale-110 transition-transform"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-8 h-8 text-green-400" />
                        ) : (
                          <Circle className="w-8 h-8 text-purple-300" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`text-lg font-medium ${task.completed ? 'line-through text-purple-300' : 'text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${priorityColors[task.priority]} text-white`}>
                            {task.priority}
                          </span>
                          <span className="text-purple-300 text-sm">
                            {new Date(task.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 p-2 hover:bg-red-500/20 rounded-xl transition-all hover:scale-110"
                      >
                        <Trash2 className="w-6 h-6 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Your Progress</h2>
              <p className="text-purple-200">Track your productivity journey</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                7-Day Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#e9d5ff" />
                  <YAxis stroke="#e9d5ff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="completed" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="total" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Completion Rate Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#e9d5ff" />
                  <YAxis stroke="#e9d5ff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#ec4899', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Priority Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {analytics.priorityData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{item.value}</p>
                        <p className="text-purple-300 text-sm">{item.completed} completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-green-400/30">
                <p className="text-green-200 text-sm mb-2">Completed</p>
                <p className="text-3xl font-bold text-white">{analytics.completedTasks}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-blue-400/30">
                <p className="text-blue-200 text-sm mb-2">Pending</p>
                <p className="text-3xl font-bold text-white">{analytics.totalTasks - analytics.completedTasks}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-purple-400/30">
                <p className="text-purple-200 text-sm mb-2">Success Rate</p>
                <p className="text-3xl font-bold text-white">{analytics.completionRate}%</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-orange-400/30">
                <p className="text-orange-200 text-sm mb-2">Streak</p>
                <p className="text-3xl font-bold text-white">{analytics.streak}🔥</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFlow;