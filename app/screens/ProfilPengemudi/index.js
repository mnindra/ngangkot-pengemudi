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

export default class Profil extends Component {

  constructor(props) {
    super(props);
    this.state = {
      langganan: 0,
    };

    this.placehold = 'http://placehold.it/300x300';
    this.navigationProps = this.props.navigation.state.params;
  }

  langganan() {
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("penumpang/" + uid + "/langganan/" + this.navigationProps.pengemudi.id_pengemudi).set({
      id_pengemudi: this.navigationProps.pengemudi.id_pengemudi,
      status: 0
    });
    this.setState({
      langganan: 1
    });
  }

  batalLangganan() {
    let uid = firebase.auth().currentUser.uid;
    // hapus data langganan
    firebase.database().ref("penumpang/" + uid + "/langganan/" + this.navigationProps.pengemudi.id_pengemudi).remove();
    this.setState({
      langganan: 0
    });
    // hapus percakapan dengan pengemudi
    firebase.database().ref('percakapan/' + uid + '_' + this.navigationProps.pengemudi.id_pengemudi).remove();
  }

  hitungRating() {
    let rating = 0;
    let ratingCount = 0;
    for(let index in this.navigationProps.pengemudi.testimoni) {
      rating += this.navigationProps.pengemudi.testimoni[index].rating;
      ratingCount++;
    }
    rating = rating / ratingCount;
    return rating;
  }

  langgananButton() {
    let langgananBtn = '';
    if(this.state.langganan == 0) {
      langgananBtn = <Button full success block onPress={() => this.langganan()}><Text>Langganan</Text></Button>
    } else {
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
            <Title>Profil Pengemudi</Title>
            </Body>
          </Header>

          <Content>
            <Content style={styles.topSection}>
              <Image  style={styles.image} source={{uri: this.navigationProps.pengemudi.foto || placehold}} />
              <Text style={styles.topSectionText}>{this.navigationProps.pengemudi.nama}</Text>
              <Text style={styles.topSectionText}>{this.navigationProps.pengemudi.email}</Text>

              <Content style={styles.ratingContent}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={this.hitungRating()}
                  starColor={'#FFEB3B'}
                  emptyStarColor={'#fff'}
                  starSize={20}
                />
              </Content>
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
                  <Text style={styles.centerSectionText}>{this.navigationProps.pengemudi.alamat}</Text>
                  </Body>
                </ListItem>

                <ListItem icon last>
                  <Left>
                    <Icon name="smartphone" style={styles.centerSectionText} />
                  </Left>
                  <Body>
                  <Text style={styles.centerSectionText}>{this.navigationProps.pengemudi.telp}</Text>
                  </Body>
                </ListItem>
              </List>
            </Content>
            <Content style={styles.bottomSection} padder>
              <Grid>
                <Col style={{paddingRight: 5}}>
                  <Button
                    primary
                    block
                    bordered
                    onPress={() => this.props.navigation.navigate('LihatAngkutan', {angkutan: this.navigationProps.pengemudi.angkutan, pengemudi: this.navigationProps.pengemudi})}>
                    <Text>lihat angkutan</Text>
                  </Button>
                </Col>

                <Col style={{paddingLeft: 5}}>
                  <Button
                    success
                    block
                    bordered
                    onPress={() => this.props.navigation.navigate('LihatTestimoni', {pengemudi: this.navigationProps.pengemudi})}>
                    <Text>Lihat Testimoni</Text>
                  </Button>
                </Col>
              </Grid>
            </Content>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}