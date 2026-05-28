import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/projects');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/projects', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/projects/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [], loading: false, creating: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createProject.pending, (state) => { state.creating = true; })
      .addCase(createProject.fulfilled, (state, action) => { 
        state.creating = false; 
        state.list.push(action.payload); 
      })
      .addCase(createProject.rejected, (state, action) => { 
        state.creating = false; 
        state.error = action.payload; 
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
