import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { fetchTasks } from '../services/taskService';

// Define icons
const CheckCircleIcon = getIcon('CheckCircle');
const ClockIcon = getIcon('Clock');
const ListChecksIcon = getIcon('ListChecks');
const LogOutIcon = getIcon('LogOut');
const UserIcon = getIcon('User');

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { tasks, stats, loading } = useSelector(state => state.tasks);
  const { logout } = useContext(AuthContext);
  
  // Load tasks from backend
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
      <motion.header 
        className="mb-8 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary dark:text-primary-light">
            TaskFlow
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-400">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-surface-600 dark:text-surface-400">
            <UserIcon className="w-5 h-5" />
            <span>{user?.firstName || 'User'}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="btn-outline flex items-center gap-2"
            aria-label="Log out"
          >
            <LogOutIcon className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>
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
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">{stats.completed}</h3>
            <p className="text-sm text-green-600 dark:text-green-500">Completed Tasks</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400">{stats.pending}</h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-500">Pending Tasks</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            <ListChecksIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">{stats.total}</h3>
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
        <MainFeature tasks={tasks} loading={loading} />
      </motion.section>
    </div>
  );
}

export default Dashboard;