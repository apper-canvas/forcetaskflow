import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    completed: 0,
    pending: 0
  }
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTasksSuccess: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
      
      // Calculate stats
      state.stats.total = action.payload.length;
      state.stats.completed = action.payload.filter(task => task.completed).length;
      state.stats.pending = state.stats.total - state.stats.completed;
    },
    setTasksError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setTasksLoading, setTasksSuccess, setTasksError } = taskSlice.actions;

export default taskSlice.reducer;