import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_articulo: {
    padding: 20
  },
  buttonContainer: {
    alignItems: 'center',
  },
  pressableButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    paddingHorizontal: 40,
    marginBottom: 10,

    width:'40%',
    alignSelf:'center',
    alignItems:'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#2196F3',
    fontSize: 16,
  },
  loginFields: {
    width: '80%',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  roleSelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50, 
  },
  logoImage: {
    width: 100, 
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10, 
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  //usados en la pagina de stock

  container_s: {
      flex: 1,
  },
  item: {
    backgroundColor: '#6ec0e0',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row', // Alinea elementos horizontalmente
    alignItems: 'center', // Alinea verticalmente en el centro
    justifyContent: 'space-between', // Espacio entre elementos
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
    title: {
    fontSize: 32,
  },
  stock: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  stock_image: {
    width:260,
    height:300,
    borderWidth:2,
    borderColor:'#e0e0e0',
    resizeMode:'contain',
    margin:8
  },
  tag: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    marginRight: 5,
    borderRadius: 10,
  },
  
  // Usados en la pagina de registrar
  flatList: {
    backgroundColor: 'white',
    marginTop: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  image_articulo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  text: {
    flex: 1,
    color: 'black',
    fontSize: 16,
  },
  errorText: {
    color: 'red', // Color del texto de error
    marginBottom: 10, // Espacio entre el texto de error y el siguiente campo
  }
});

export default styles;