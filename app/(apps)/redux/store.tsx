import { configureStore, createSlice } from '@reduxjs/toolkit';

// Crear un slice para manejar el estado del email y el id
const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    name: '',
    id: ''  // Agregar el campo id
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;  // Corregir el campo que actualiza name
    },
    setId: (state, action) => {
      state.id = action.payload;  // Nuevo reductor para actualizar el id
    }
  }
});

// Configurar el store
const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export const { setEmail, setName, setId } = userSlice.actions;
export default store;
