import { configureStore, createSlice } from '@reduxjs/toolkit';

// Crear un slice para manejar el estado del email
const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: ''
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    }
  }
});

// Configurar el store
const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export const { setEmail } = userSlice.actions;
export default store;
