import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface TopicsState {
  selectedTopic: string;
}

const initialState: TopicsState = {
  selectedTopic: '',
};

export const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    selectedTopicUpdated(state, action: PayloadAction<string>) {
      state.selectedTopic = action.payload;
    },
  },
});

export const { selectedTopicUpdated } = topicsSlice.actions;

export const selectSelectedTopic = (state: RootState) => state.topics.selectedTopic;

export default topicsSlice.reducer;