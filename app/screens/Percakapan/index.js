import React, {Component} from 'react';
import {
  Content,
  Text,
  List,
  ListItem,
  Body,
  Thumbnail,
  Right
} from 'native-base';
import {Alert} from 'react-native';
import firebase from '../../config/firebase';
import styles from './styles';

export default class Percakapan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      percakapan: [],
      penumpang: {}
    }
  }

  componentDidMount() {
    this.setState({percakapan: []});
    let i = 0;
    for (let index in this.props.percakapan) {
      let id_pengemudi = index.split("_")[1];
      firebase.database().ref("pengemudi/" + id_pengemudi).once("value").then((snapshot) => {
        let percakapan = this.state.percakapan;
        percakapan[i] = this.props.percakapan[index];
        percakapan[i].pengemudi = snapshot.val();
        this.setState({percakapan});
        i++;
      });
    }
  }

  renderRow(rowData) {

    let pesan = [];
    for (let index in rowData.pesan) {
      pesan.push(rowData.pesan[index]);
    }

    return (
      <ListItem
        avatar
        button
        onPress={() => this.props.parent.props.navigation.navigate('RuangPercakapan', {penumpang: this.props.user, pengemudi: rowData.pengemudi})}>
        <Thumbnail size={80} source={{ uri: rowData.pengemudi.foto || 'http://placehold.it/300x300' }} />
        <Body>
        <Text>{rowData.pengemudi.nama}</Text>
        <Text note>{pesan[pesan.length - 1].waktu}</Text>
        <Text>{pesan[pesan.length - 1].isi}</Text>
        </Body>
      </ListItem>
    )
  }

  render () {
    return (
      <Content style={styles.content}>
        <List dataArray={this.state.percakapan} renderRow={(rowData) => this.renderRow(rowData)}></List>
      </Content>
    )
  }

}