import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

// Define icons
const PlusIcon = getIcon('Plus');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');
const AlertCircleIcon = getIcon('AlertCircle');
const ClockIcon = getIcon('Clock');
const TrashIcon = getIcon('Trash');
const EditIcon = getIcon('Edit');
const CalendarIcon = getIcon('Calendar');
const FlagIcon = getIcon('Flag');
const PlusSquareIcon = getIcon('PlusSquare');

function MainFeature({ onTasksChange }) {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
  });
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    if (filter === 'high') return task.priority === 'high';
    if (filter === 'medium') return task.priority === 'medium';
    if (filter === 'low') return task.priority === 'low';
    return true;
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return false;
    }
    return true;
  };
  
  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'medium',
    });
    setIsEditing(false);
    setEditingId(null);
  };
  
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      resetForm();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isEditing) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingId 
          ? { ...task, ...newTask, updatedAt: new Date() }
          : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully!");
    } else {
      // Add new task
      const task = {
        ...newTask,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTasks([...tasks, task]);
      toast.success("Task added successfully!");
    }
    
    resetForm();
    setIsFormVisible(false);
  };
  
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    
    const completedTask = updatedTasks.find(task => task.id === id);
    if (completedTask?.completed) {
      toast.success("Task completed! 🎉");
    }
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.info("Task deleted");
  };
  
  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setNewTask({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate || format(new Date(), 'yyyy-MM-dd'),
        priority: taskToEdit.priority || 'medium',
      });
      setIsEditing(true);
      setEditingId(id);
      setIsFormVisible(true);
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'bg-green-100 dark:bg-green-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };
  
  return (
    <div className="card p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
          My Tasks
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select 
            className="input text-sm py-1 px-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter tasks"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 self-start"
            onClick={toggleForm}
            aria-label={isFormVisible ? "Close form" : "Add new task"}
          >
            {isFormVisible ? 
              <>
                <XIcon className="w-4 h-4" />
                <span>Cancel</span>
              </> : 
              <>
                <PlusIcon className="w-4 h-4" />
                <span>New Task</span>
              </>
            }
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {isFormVisible && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card border-2 border-primary-light dark:border-primary p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary dark:text-primary-light flex items-center gap-2">
                <PlusSquareIcon className="w-5 h-5" />
                {isEditing ? "Edit Task" : "Create New Task"}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Task Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="What needs to be done?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="input min-h-[80px]"
                    placeholder="Add details about this task (optional)"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300 flex items-center gap-1">
                      <FlagIcon className="w-4 h-4" />
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <motion.button
                    type="button"
                    className="btn bg-surface-200 text-surface-700 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
                    onClick={toggleForm}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="btn-primary"
                    whileTap={{ scale: 0.95 }}
                  >
                    {isEditing ? "Update Task" : "Add Task"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircleIcon className="mx-auto h-12 w-12 text-surface-400 mb-4" />
            <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300">No tasks found</h3>
            <p className="mt-1 text-surface-500 dark:text-surface-400">
              {filter === 'all' ? 
                "Get started by adding a new task!" : 
                `No ${filter} tasks found. Try a different filter.`}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-surface-200 dark:divide-surface-700">
            {filteredTasks.map((task) => (
              <motion.li 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-surface-50 dark:hover:bg-surface-800/50 rounded-lg p-2 -mx-2 ${task.completed ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
                      task.completed 
                        ? 'bg-primary border-primary text-white' 
                        : 'border-surface-300 dark:border-surface-600'
                    } flex items-center justify-center`}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed && <CheckIcon className="w-3 h-3" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-md font-medium break-words ${
                        task.completed 
                          ? 'line-through text-surface-500 dark:text-surface-400' 
                          : 'text-surface-800 dark:text-surface-200'
                      }`}>
                        {task.title}
                      </h3>
                      
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBg(task.priority)} ${getPriorityColor(task.priority)} font-medium`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="mt-1 text-sm text-surface-600 dark:text-surface-400 break-words">
                        {task.description}
                      </p>
                    )}
                    
                    {task.dueDate && (
                      <div className="mt-2 flex items-center text-xs text-surface-500 dark:text-surface-400">
                        <ClockIcon className="mr-1 h-3.5 w-3.5" />
                        <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => editTask(task.id)}
                    className="p-1.5 rounded-full text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700"
                    aria-label="Edit task"
                  >
                    <EditIcon className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                    aria-label="Delete task"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MainFeature;