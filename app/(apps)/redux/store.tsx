import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Slice para manejar el estado del usuario
const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    name: '',
    id: '',
    role:'',
    urifoto:''
  },
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setUriFoto: (state, action: PayloadAction<string>) => {
      state.urifoto = action.payload;
    },
    vaciar: (state)=>{
      state.name ='';
      state.id ='';
      state.role ='';
      state.email ='';

    }
  }
});

// Slice para manejar el estado del carrito de compras
const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    items: [] as { id_producto: number; nombre: string; cantidad: number; precio: number }[]
  },
  reducers: {
    agregarProducto: (state, action: PayloadAction<{ id_producto: number; nombre: string; precio: number }>) => {
      const productoExistente = state.items.find(item => item.id_producto === action.payload.id_producto);
      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        state.items.push({ ...action.payload, cantidad: 1 });
      }
    },
    agregarProductos: (state, action: PayloadAction<{ id_producto: number; nombre: string; precio: number; cantidad: number }>) => {
      const productoExistente = state.items.find(item => item.id_producto === action.payload.id_producto);
      if (productoExistente) {
        productoExistente.cantidad = action.payload.cantidad;
      } else {
        state.items.push({ ...action.payload});
      }
    },
    eliminarProducto: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(item => item.id_producto === action.payload);
      if (index !== -1) {
        state.items[index].cantidad > 1 ? state.items[index].cantidad-- : state.items.splice(index, 1);
      }
    },
    vaciarCarrito: (state) => {
      state.items = [];
    }
  }
});

// Configurar el store con múltiples slices
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    carrito: carritoSlice.reducer
  }
});

// Exportar las acciones
export const { setEmail, setName, setId, setRole, setUriFoto,vaciar } = userSlice.actions;
export const { agregarProducto, agregarProductos, eliminarProducto, vaciarCarrito } = carritoSlice.actions;

export default store;
