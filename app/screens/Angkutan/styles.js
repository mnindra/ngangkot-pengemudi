import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00BCD4'
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 30,
    height: 35
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 30,
    marginTop: 30
  },
  form: {
    marginBottom: 20
  },
  formText: {
    color: '#5f5f5f',
    textAlign: 'center'
  },
  formIcon: {
    color: '#5f5f5f'
  },
  formButton: {
    margin: 5
  },
  formItem: {
    marginBottom: 10
  },
  formLabel: {
    paddingLeft: 12
  },
  formPicker: {
    marginLeft: 5
  },
  card: {
    paddingTop: 20
  }
});

export default styles;