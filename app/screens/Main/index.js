import React, { Component } from 'react';
import {
  Container,
  Header,
  Content,
  Button,
  Footer,
  FooterTab,
  Icon,
  StyleProvider,
  Left,
  Right,
  Body,
  Text,
  Title
} from 'native-base';
import { Alert } from 'react-native';
import getTheme from '../../../native-base-theme/components/index';
import material from '../../../native-base-theme/variables/material';
import Ngangkot from '../Ngangkot/index';
import Percakapan from '../Percakapan/index';
import Langganan from '../Langganan/index';
import Profil from '../Profil/index';
import firebase from '../../config/firebase';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.navigation.state.params ? this.props.navigation.state.params.activeTab : "ngangkot",
      userDB: '',
      langganan: [],
      percakapan: {}
    };
  }

  Logout() {
    firebase.database().ref('penumpang/' + this.state.userDB.id_penumpang).update({online: 0});
    firebase.auth().signOut();
    this.props.navigation.navigate('Login');
  }

  getContent() {
    let content = '';
    switch (this.state.activeTab) {
      case 'ngangkot':
        content = <Ngangkot parent={this} />;
        break;
      case 'percakapan':
        content = <Percakapan parent={this} percakapan={this.state.percakapan} user={this.state.userDB} />;
        break;
      case 'langganan':
        content = <Langganan parent={this} user={this.state.userDB} langganan={this.state.langganan} />;
        break;
      case 'profil':
        content = <Profil parent={this} user={this.state.userDB} />;
        break;
    }
    return content;
  }

  componentDidMount() {
    // ambil data penumpang saat ini
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("penumpang/" + uid).on("value", (snapshot) => {
      this.setState({ userDB: snapshot.val() });

      // ambil data langganan penumpang
      this.setState({langganan: []});
      for (let index in snapshot.val().langganan) {
        firebase.database().ref('pengemudi/' + index).once("value").then((snapshot) => {
          let array = this.state.langganan;
          array.push(snapshot.val());
          this.setState({
            langganan: array
          });
        });
      }
    });

    // ambil data percakapan
    firebase.database().ref("percakapan").on("value", (snapshot) => {
      let percakapan = {};
      for (let index in snapshot.val()) {
        if(index.indexOf(firebase.auth().currentUser.uid) > -1) {
          percakapan[index] = snapshot.val()[index];
        }
      }
      this.setState({ percakapan });
    });
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header noShadow>
            <Body>
              <Title>{ this.state.activeTab.charAt(0).toUpperCase() + this.state.activeTab.slice(1) }</Title>
            </Body>
            <Right>
              <Button danger onPress={() => this.Logout()}>
                <Text>Keluar</Text>
              </Button>
            </Right>
          </Header>

          { this.getContent() }

          <Footer>
            <FooterTab>
              <Button
                active={this.state.activeTab == 'ngangkot'}
                onPress={() => this.setState({activeTab: 'ngangkot'})}>
                <Icon name="directions-car"/>
              </Button>

              <Button
                active={this.state.activeTab == 'percakapan'}
                onPress={() => this.setState({activeTab: 'percakapan'})}>
                <Icon name="message"/>
              </Button>

              <Button
                active={this.state.activeTab == 'langganan'}
                onPress={() => this.setState({activeTab: 'langganan'})}>
                <Icon name="contact-mail"/>
              </Button>

              <Button
                active={this.state.activeTab == 'profil'}
                onPress={() => this.setState({activeTab: 'profil'})}>
                <Icon name="person" />
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }
}