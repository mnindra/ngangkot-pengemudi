import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  content: {
    backgroundColor: '#f1f1f1'
  },
  listItem: {
    paddingBottom:10
  },
  containerPesanPenumpang: {
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#00B386',
    borderRadius: 15
  },
  pesanPenumpang: {
    textAlign: 'right',
    color: '#fff'
  },
  containerPesanPengemudi: {
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#0288d1',
    borderRadius: 15
  },
  pesanPengemudi: {
    textAlign: 'left',
    color: '#fff'
  },
  inputPesan: {
    height: 100
  },
  buttonPesan: {
    marginTop: 10
  }
});

export default styles;