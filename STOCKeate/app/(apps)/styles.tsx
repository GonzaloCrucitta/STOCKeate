import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    title: {
    fontSize: 32,
  },
  stock_image: {
  width:260,
    height:300,
    borderWidth:2,
    borderColor:'#d35647',
    resizeMode:'contain',
    margin:8
  },
  
  // Usados en la pagina de registrar
  flatList: {
    backgroundColor: 'white',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  text: {
    flex: 1,
    color: 'black',
  },
});

export default styles;