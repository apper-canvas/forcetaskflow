import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Define icons
const CheckCircleIcon = getIcon('CheckCircle');
const ClockIcon = getIcon('Clock');
const ListChecksIcon = getIcon('ListChecks');

function Home() {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  
  // Initialize from local storage or set defaults
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completed = savedTasks.filter(task => task.completed).length;
    setCompletedTasks(completed);
    setPendingTasks(savedTasks.length - completed);
    setTotalTasks(savedTasks.length);
  }, []);

  // Update stats when tasks change
  const updateStats = (tasks) => {
    const completed = tasks.filter(task => task.completed).length;
    setCompletedTasks(completed);
    setPendingTasks(tasks.length - completed);
    setTotalTasks(tasks.length);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
      <motion.header 
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary dark:text-primary-light">
          TaskFlow
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
      </motion.header>

      {/* Stats Section */}
      <motion.section 
        className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">{completedTasks}</h3>
            <p className="text-sm text-green-600 dark:text-green-500">Completed Tasks</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400">{pendingTasks}</h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-500">Pending Tasks</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            <ListChecksIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">{totalTasks}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-500">Total Tasks</p>
          </div>
        </div>
      </motion.section>

      {/* Main Feature Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <MainFeature onTasksChange={updateStats} />
      </motion.section>
    </div>
  );
}

export default Home;