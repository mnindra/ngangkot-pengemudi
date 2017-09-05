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
      let id_penumpang = index.split("_")[0];
      firebase.database().ref("penumpang/" + id_penumpang).once("value").then((snapshot) => {
        let percakapan = this.state.percakapan;
        percakapan[i] = this.props.percakapan[index];
        percakapan[i].penumpang = snapshot.val();
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
        onPress={() => this.props.parent.props.navigation.navigate('RuangPercakapan', {pengemudi: this.props.user, penumpang: rowData.penumpang})}>
        <Thumbnail size={80} source={{ uri: rowData.penumpang.foto || 'http://placehold.it/300x300' }} />
        <Body>
        <Text>{rowData.penumpang.nama}</Text>
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