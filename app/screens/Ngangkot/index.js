import React, {Component} from 'react';
import {
  Content,
  Text,
  Button,
} from 'native-base';
import {Image, View} from 'react-native';
import styles from './styles';

export default class Ngangkot extends Component {

  constructor(props) {
    super(props);
    this.navigation = this.props.parent.props.navigation;
  }

  render () {
    return (
        <View style={styles.content}>
          <Image style={styles.logo} source={require('../../images/logo.png')} />
          <Button style={styles.button} onPress={() => this.navigation.navigate('LokasiAwal')}><Text>Cari Angkot</Text></Button>
        </View>
    )
  }

}