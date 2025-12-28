import { configureStore } from '@reduxjs/toolkit';
import todosSlice from './taskManagement';

const store = configureStore({
  reducer: {
    tasks: todosSlice,
  },
});

export default store;
