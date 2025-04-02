import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/index';
import { topicsMap, Topic } from '../types/topics';

interface TopicsState {
  selectedTopic: Topic | '';
  subtopics: string[];
  selectedSubtopics: string[];
}

const initialState: TopicsState = {
  selectedTopic: '',
  subtopics: [],
  selectedSubtopics: [],
};

export const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    selectedTopicUpdated(state, action: PayloadAction<Topic | ''>) {
      state.selectedTopic = action.payload;
      if (action.payload) {
        state.subtopics = [...topicsMap[action.payload]];
        
        // Randomly select 3 subtopics
        const allSubtopics = [...state.subtopics];
        const selectedSubtopics = new Set<string>();
        while (selectedSubtopics.size < 3) {
          const randomIndex = Math.floor(Math.random() * allSubtopics.length);
          selectedSubtopics.add(allSubtopics[randomIndex]);
        }
        state.selectedSubtopics = Array.from(selectedSubtopics);
      } else {
        state.subtopics = [];
        state.selectedSubtopics = [];
      }
    },
    subtopicToggled(state, action: PayloadAction<string>) {
      const subtopic = action.payload;
      const index = state.selectedSubtopics.indexOf(subtopic);
      if (index === -1) {
        state.selectedSubtopics.push(subtopic);
      } else {
        state.selectedSubtopics.splice(index, 1);
      }
    },
  },
});

export const { selectedTopicUpdated, subtopicToggled } = topicsSlice.actions;

export const selectSelectedTopic = (state: RootState) => state.topics.selectedTopic;
export const selectSubtopics = (state: RootState) => state.topics.subtopics;
export const selectSelectedSubtopics = (state: RootState) => state.topics.selectedSubtopics;

export default topicsSlice.reducer;
