import React, {Component} from 'react';
import {
  Content,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Right,
  Button,
  Icon
} from 'native-base';
import {Alert, View} from 'react-native';
import firebase from '../../config/firebase';
import styles from "./styles";

export default class Langganan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      penumpang: []
    }
  }

  konfirmasi(id_penumpang) {
    let uid = firebase.auth().currentUser.uid;
    // hapus data langganan
    firebase.database().ref('penumpang/' + id_penumpang + '/langganan/' + uid).update({
      status: 1
    });
  }

  batal(id_penumpang) {
    let uid = firebase.auth().currentUser.uid;
    // hapus data langganan
    firebase.database().ref('penumpang/' + id_penumpang + '/langganan/' + uid).remove();
    // hapus percakapan dengan pengemudi
    firebase.database().ref('percakapan/' + id_penumpang + '_' + uid).remove();
  }

  renderRow(rowData) {
    let konfirmasi;
    let btnKonfirmasi;

    if(rowData.langganan[this.props.user.id_pengemudi].status == 0) {
      konfirmasi = 'Belum Dikonfirmasi';
      btnKonfirmasi = <Button smsall transparent onPress={() => this.konfirmasi(rowData.id_penumpang)} success>
        <Icon name="check-circle" />
      </Button>
    }

    return (
      <ListItem
        avatar
        button
        onPress={() => this.props.parent.props.navigation.navigate('ProfilPenumpang', {penumpang:rowData, pengemudi: this.props.user})}
        style={styles.listItem}>
        <Left>
          <Thumbnail source={{ uri: rowData.foto || 'http://placehold.it/300x300' }} />
        </Left>
        <Body>
        <Text>{rowData.nama}</Text>
        <Text note style={{color: '#b5423c'}}>{konfirmasi}</Text>
        </Body>
        <Right style={styles.buttonContainer}>
          <View style={styles.buttonGroup}>
            {btnKonfirmasi}
            <Button transparent small danger onPress={() => this.batal(rowData.id_penumpang)}>
              <Icon name="delete"/>
            </Button>
          </View>
        </Right>
      </ListItem>
    )
  }

  render () {
    return (
      <Content style={styles.content} padder>
        <List dataArray={this.props.langganan} renderRow={(rowData) => this.renderRow(rowData)}></List>
      </Content>
    )
  }

}