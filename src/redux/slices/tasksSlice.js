import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (projectId, { rejectWithValue }) => {
  try {
    const res = await API.get(`/projects/${projectId}/tasks`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createTask = createAsyncThunk('tasks/create', async ({ projectId, data }, { rejectWithValue }) => {
  try {
    const res = await API.post(`/projects/${projectId}/tasks`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const toggleTask = createAsyncThunk('tasks/toggle', async ({ projectId, taskId, status }, { rejectWithValue }) => {
  try {
    const res = await API.patch(`/projects/${projectId}/tasks/${taskId}`, { status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async ({ projectId, taskId }, { rejectWithValue }) => {
  try {
    await API.delete(`/projects/${projectId}/tasks/${taskId}`);
    return taskId;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], loading: false, creating: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createTask.pending, (state) => { state.creating = true; })
      .addCase(createTask.fulfilled, (state, action) => { state.creating = false; state.list.push(action.payload); })
      .addCase(createTask.rejected, (state, action) => { state.creating = false; state.error = action.payload; })

      .addCase(toggleTask.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
