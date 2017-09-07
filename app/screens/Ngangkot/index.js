import React, {Component} from 'react';
import {
  Content,
  Text,
  Button,
} from 'native-base';
import {Image, View} from 'react-native';
import styles from './styles';
import firebase from '../../config/firebase';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Ngangkot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingAnimation: false
    };
    this.navigation = this.props.parent.props.navigation;
  }

  cariPenumpang() {
    this.setState({loadingAnimation: true});
    let id_rute = this.props.user.angkutan.id_rute;
    firebase.database().ref("rute/" + id_rute).once("value").then((snapshot) => {
      // mengumpulkan semua overview path
      let overview_path = [];
      for (let index in snapshot.val().rute.routes[0].overview_path) {
        let obj = {
          latitude: snapshot.val().rute.routes[0].overview_path[index].lat,
          longitude: snapshot.val().rute.routes[0].overview_path[index].lng
        };
        overview_path.push(obj);
      }
      this.setState({loadingAnimation: false});
      this.navigation.navigate('MulaiNgangkot', {pengemudi: this.props.user, overview_path: overview_path});
    });
  }

  render () {
    return (
        <View style={styles.content}>
          <Image style={styles.logo} source={require('../../images/logo.png')} />
          <Button style={styles.button} onPress={() => this.cariPenumpang()}><Text>Cari Penumpang</Text></Button>
          <Spinner
            visible={this.state.loadingAnimation}
            textContent={"Memuat peta..."}
            textStyle={{color: '#FFF'}}
            overlayColor={"#00BCD4"}/>
        </View>
    )
  }

}