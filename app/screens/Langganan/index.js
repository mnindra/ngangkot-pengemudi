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
  Button
} from 'native-base';
import {Alert} from 'react-native';
import firebase from '../../config/firebase';
import styles from "./styles";

export default class Langganan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pengemudi: []
    }
  }

  batal(id_pengemudi) {
    let uid = firebase.auth().currentUser.uid;
    // hapus data langganan
    firebase.database().ref('penumpang/' + uid + '/langganan/' + id_pengemudi).remove();
    // hapus percakapan dengan pengemudi
    firebase.database().ref('percakapan/' + uid + '_' + id_pengemudi).remove();

  }

  renderRow(rowData) {
    let konfirmasi;
    if (this.props.user.langganan[rowData.id_pengemudi].status == 0) {
      konfirmasi = 'Belum Dikonfirmasi';
    }

    return (
      <ListItem
        avatar
        button
        onPress={() => this.props.parent.props.navigation.navigate('ProfilPengemudi', {pengemudi:rowData, penumpang: this.props.user})}
        style={styles.listItem}>
        <Left>
          <Thumbnail source={{ uri: rowData.foto || 'http://placehold.it/300x300' }} />
        </Left>
        <Body>
        <Text>{rowData.nama}</Text>
        <Text note style={{color: '#b5423c'}}>{konfirmasi}</Text>
        </Body>
        <Right>
          <Button small danger onPress={() => this.batal(rowData.id_pengemudi)}><Text>Batal</Text></Button>
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