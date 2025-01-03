"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { 
  Bell, Search, Menu, X, Settings, Users, FileText, 
  Home, Activity, Clock, Calendar, MoreVertical, Download, 
  Trash2, Edit3, Eye, Filter, ChevronDown, MessageSquare,
  Sun, Moon, Upload, RefreshCw, Mail, LogOut
} from 'lucide-react';
import ProfileMenu from "@/components/ProfileMenu";

const DashboardPage = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for charts
  const activityData = [
    { month: 'Jan', documents: 65, tasks: 40, team: 24 },
    { month: 'Feb', documents: 78, tasks: 52, team: 30 },
    { month: 'Mar', documents: 82, tasks: 61, team: 41 },
    { month: 'Apr', documents: 70, tasks: 47, team: 35 },
    { month: 'May', documents: 85, tasks: 55, team: 29 },
    { month: 'Jun', documents: 92, tasks: 63, team: 44 },
  ];

  const pieData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'In Progress', value: 30, color: '#3B82F6' },
    { name: 'Pending', value: 25, color: '#EF4444' },
  ];

  const stats = [
    { id: 1, label: 'Total Documents', value: '2,543', change: '+12.5%', icon: FileText },
    { id: 2, label: 'Team Members', value: '48', change: '+4.3%', icon: Users },
    { id: 3, label: 'Active Projects', value: '12', change: '+2.8%', icon: Activity },
    { id: 4, label: 'Tasks Completed', value: '186', change: '+8.2%', icon: Clock },
  ];

  const recentActivities = [
    { id: 1, user: 'Sarah Johnson', action: 'uploaded', target: 'Q4 Report.pdf', time: '5 mins ago' },
    { id: 2, user: 'Mike Chen', action: 'commented on', target: 'Project Proposal', time: '15 mins ago' },
    { id: 3, user: 'Emma Wilson', action: 'completed', target: 'Design Review', time: '1 hour ago' },
    { id: 4, user: 'Alex Turner', action: 'created', target: 'New Task', time: '2 hours ago' },
  ];

  const tasks = [
    { id: 1, title: 'Review Marketing Plan', priority: 'High', dueDate: '2024-02-01', status: 'In Progress' },
    { id: 2, title: 'Update Documentation', priority: 'Medium', dueDate: '2024-02-03', status: 'Pending' },
    { id: 3, title: 'Team Sync Meeting', priority: 'High', dueDate: '2024-02-01', status: 'Completed' },
  ];

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-50';
      case 'in progress': return 'text-blue-500 bg-blue-50';
      case 'pending': return 'text-yellow-500 bg-yellow-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside 
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          fixed h-full z-30 transition-all duration-300
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          border-r
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Workspace
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { icon: Home, label: 'Overview', id: 'overview' },
              { icon: FileText, label: 'Documents', id: 'documents' },
              { icon: Users, label: 'Team', id: 'team' },
              { icon: Activity, label: 'Analytics', id: 'analytics' },
              { icon: Calendar, label: 'Calendar', id: 'calendar' },
              { icon: MessageSquare, label: 'Messages', id: 'messages' },
              { icon: Settings, label: 'Settings', id: 'settings' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${activeTab === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
          <h2 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg">
              <Bell size={20} />
            </button>
            <ProfileMenu />
          </div>
        </header>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div>
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                  <div key={stat.id} className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <div className="flex items-center space-x-3">
                      <stat.icon size={30} />
                      <div>
                        <h3 className="text-sm font-medium">{stat.label}</h3>
                        <p className="text-lg font-semibold">{stat.value}</p>
                      </div>
                    </div>
                    <p className={`mt-2 text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
                  </div>
                ))}
              </section>

              <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <h4 className="text-lg font-semibold mb-4">Activity Overview</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#ddd'} />
                      <XAxis dataKey="month" stroke={isDarkMode ? '#fff' : '#000'} />
                      <YAxis stroke={isDarkMode ? '#fff' : '#000'} />
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                      <Legend />
                      <Line type="monotone" dataKey="documents" stroke="#3B82F6" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="tasks" stroke="#10B981" />
                      <Line type="monotone" dataKey="team" stroke="#EF4444" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <h4 className="text-lg font-semibold mb-4">Task Breakdown</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;