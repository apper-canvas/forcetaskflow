import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Define icons
const AlertCircleIcon = getIcon('AlertCircle');
const HomeIcon = getIcon('Home');

function NotFound() {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-5 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-8">
        <motion.div
          className="inline-block text-primary-dark dark:text-primary-light mb-4"
          initial={{ scale: 0.5, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <AlertCircleIcon className="w-24 h-24 md:w-32 md:h-32" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-lg mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link to="/" className="btn-primary flex items-center gap-2 shadow-soft">
          <HomeIcon className="w-5 h-5" />
          <span>Return Home</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default NotFound;