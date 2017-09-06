import React, {Component} from 'react';
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Icon,
  Button,
  Grid,
  Col,
  Header,
  Title,
  StyleProvider
} from 'native-base';
import getTheme from '../../../native-base-theme/components/index';
import material from '../../../native-base-theme/variables/material';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import firebase from '../../config/firebase';
import StarRating from 'react-native-star-rating';
import styles from './styles';

export default class ProfilPenumpang extends Component {

  constructor(props) {
    super(props);
    this.state = {
      langganan: 0,
    };

    this.placehold = 'http://placehold.it/300x300';
    this.navigationProps = this.props.navigation.state.params;
  }

  batalLangganan() {
    let uid = firebase.auth().currentUser.uid;
    // hapus data langganan
    firebase.database().ref("penumpang/" + this.navigationProps.penumpang.id_penumpang + "/langganan/" + uid).remove();
    this.setState({
      langganan: 0
    });
    // hapus percakapan dengan pengemudi
    firebase.database().ref('percakapan/' + this.navigationProps.penumpang.id_penumpang + '_' + uid).remove();
  }

  langgananButton() {
    let langgananBtn;
    if(this.state.langganan == 1) {
      langgananBtn = <Button full danger block  onPress={() => this.batalLangganan()}><Text>Batal Langganan</Text></Button>
    }
    return langgananBtn;
  }

  pesanButton() {
    let pesanBtn;
    if(this.state.langganan == 1 && this.navigationProps.penumpang.langganan[this.navigationProps.pengemudi.id_pengemudi].status == 1) {
      pesanBtn = <Button
        transparent
        light
        style={{marginLeft: 'auto', marginRight: 'auto'}}
        onPress={() => this.props.navigation.navigate('RuangPercakapan', {penumpang: this.navigationProps.penumpang, pengemudi: this.navigationProps.pengemudi})}>
        <Icon name="message" />
      </Button>
    }
    return pesanBtn;
  }

  componentDidMount() {
    for (let index in this.navigationProps.penumpang.langganan) {
      if (index == this.navigationProps.pengemudi.id_pengemudi) {
        this.setState({
          langganan: 1
        });
      }
    }
  }

  render () {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header noShadow>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="chevron-left" />
              </Button>
            </Left>
            <Body>
            <Title>Profil Penumpang</Title>
            </Body>
          </Header>

          <Content>
            <Content style={styles.topSection}>
              <Image  style={styles.image} source={{uri: this.navigationProps.penumpang.foto || this.placehold}} />
              <Text style={styles.topSectionText}>{this.navigationProps.penumpang.nama}</Text>
              <Text style={styles.topSectionText}>{this.navigationProps.penumpang.email}</Text>
              {this.pesanButton()}
            </Content>

            {this.langgananButton()}

            <Content style={styles.centerSection}>
              <List>
                <ListItem icon first>
                  <Left>
                    <Icon name="place" style={styles.centerSectionText} />
                  </Left>
                  <Body>
                  <Text style={styles.centerSectionText}>{this.navigationProps.penumpang.alamat}</Text>
                  </Body>
                </ListItem>

                <ListItem icon last>
                  <Left>
                    <Icon name="smartphone" style={styles.centerSectionText} />
                  </Left>
                  <Body>
                  <Text style={styles.centerSectionText}>{this.navigationProps.penumpang.telp}</Text>
                  </Body>
                </ListItem>
              </List>
            </Content>
            <Content style={styles.bottomSection} padder>

            </Content>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}