STOCKeate - Aplicación de Control de Stock

Aplicación móvil desarrollada con React Native + Expo para la gestión de stock de productos. Permite a los usuarios visualizar, agregar y modificar productos, junto con funcionalidades de autenticación, carga de imágenes y almacenamiento persistente.

---

Tecnologías utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [TypeScript](https://www.typescriptlang.org/) (si aplica)
- [Expo Router](https://expo.github.io/router/docs)

---

Configuración del entorno

Requisitos previos

Tener instalado:

- Node.js (versión recomendada: ≥ 18)
- npm (≥ 9)
- Expo CLI:


2. Clonar el repositorio:

git clone https://github.com/tu-usuario/stockeate.git
cd stockeate

3. Instalar dependencias

npm install


4. Variables de entorno

Configurar la variable de entorno modificando el archivo .env, indicando la ip usada en la computadora. Para ello puede usar ipconfig en la cmd para obtener la misma.

5. Ejecutar la aplicación

npm run start


Estructura del proyecto:

.
├── App.tsx / index.tsx         # Entrada principal
├── redux/
│   └── store.ts                # Configuración de Redux y acciones
├── screens/
│   ├── login.tsx
│   ├── perfil.tsx
│   ├── home.tsx
│   └── ...
├── assets/                     # Imágenes, iconos
├── styles.ts                   # Estilos centralizados
└── ...

