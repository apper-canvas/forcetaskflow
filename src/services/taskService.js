import { setTasksLoading, setTasksSuccess, setTasksError } from '../store/taskSlice';

// Get ApperClient from global scope
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Fetch all tasks for the current user
export const fetchTasks = () => async (dispatch) => {
  dispatch(setTasksLoading());
  try {
    const client = getClient();
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "dueDate" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "completed" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "ModifiedOn" } },
        { Field: { Name: "Owner" } }
      ],
      orderBy: [
        { field: "dueDate", direction: "asc" },
        { field: "CreatedOn", direction: "desc" }
      ]
    };
    
    const response = await client.fetchRecords('task', params);
    
    if (response && response.data) {
      // Format tasks for our application
      const formattedTasks = response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title || 'Untitled Task',
        description: task.description || '',
        dueDate: task.dueDate || null,
        priority: task.priority || 'medium',
        completed: task.completed || false,
        createdAt: task.CreatedOn || new Date(),
        updatedAt: task.ModifiedOn || new Date(),
        owner: task.Owner
      }));
      
      dispatch(setTasksSuccess(formattedTasks));
      return formattedTasks;
    } else {
      dispatch(setTasksSuccess([]));
      return [];
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    dispatch(setTasksError(error.message || "Failed to fetch tasks"));
    return [];
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const client = getClient();
    const params = {
      records: [{
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate || null,
        priority: taskData.priority || 'medium',
        completed: false
      }]
    };
    
    const response = await client.createRecord('task', params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      const createdTask = response.results[0].data;
      return {
        success: true,
        task: {
          id: createdTask.Id.toString(),
          title: createdTask.title,
          description: createdTask.description || '',
          dueDate: createdTask.dueDate || null,
          priority: createdTask.priority || 'medium',
          completed: createdTask.completed || false,
          createdAt: createdTask.CreatedOn || new Date(),
          updatedAt: createdTask.ModifiedOn || new Date()
        }
      };
    } else {
      throw new Error("Failed to create task");
    }
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error: error.message || "Failed to create task"
    };
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const client = getClient();
    const params = {
      records: [{
        Id: parseInt(taskId),
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: taskData.completed
      }]
    };
    
    const response = await client.updateRecord('task', params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return {
        success: true,
        task: response.results[0].data
      };
    } else {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      success: false,
      error: error.message || "Failed to update task"
    };
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const client = getClient();
    const params = {
      RecordIds: [parseInt(taskId)]
    };
    
    const response = await client.deleteRecord('task', params);
    
    return { success: response && response.success };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      error: error.message || "Failed to delete task"
    };
  }
};