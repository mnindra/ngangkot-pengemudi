import React from 'react';
import ValidationComponent from 'react-native-form-validator';
import {
  Content,
  Text,
  List,
  ListItem,
  Body,
  Thumbnail,
  Right,
  Container,
  Header,
  Title,
  Left,
  Button,
  Icon,
  StyleProvider,
  Form,
  Item,
  Input,
  Label
} from 'native-base';
import StarRating from 'react-native-star-rating';
import ErrorLabel from '../../components/ErrorLabel';
import getTheme from '../../../native-base-theme/components/index';
import material from '../../../native-base-theme/variables/material';
import firebase from '../../config/firebase';
import styles from './styles';

export default class LihatTestimoni extends ValidationComponent {

  constructor(props) {
    super(props);
    this.placehold = 'http://placehold.it/300x300';
    this.navigationProps = this.props.navigation.state.params;
    this.state = {
      testimoni: [],
      'testimoni ': '',
      rating: 0,
      errors: {}
    }
  }

  beriTestimoni() {
    this.validasiForm();

    if(this.isFormValid()) {
      let d = new Date();
      let tanggal = String(d.getDate());
      let bulan = String(d.getMonth() + 1);
      let tahun = String(d.getFullYear());

      firebase.database().ref('pengemudi/' + this.navigationProps.pengemudi.id_pengemudi + '/testimoni').push({
        id_penumpang: firebase.auth().currentUser.uid,
        isi: this.state['testimoni '],
        rating: this.state.rating,
        tanggal: `${tanggal}/${bulan}/${tahun}`
      });
      this.reset();
    }
  }

  reset() {
    this.setState({
      'testimoni ': '',
      'rating': 0
    });
  }

  validasiForm() {
    this.validate({
      'testimoni ': {required: true},
    });

    let errors = {};
    let errors_string = this.getErrorMessages().split("\n");
    errors_string.forEach((error) => {
      for (let key in this.state) {
        if (error.indexOf(key) !== -1) {
          errors[key] = error;
        }
      }
    });
    this.setState({errors});
  }

  componentDidMount() {
    firebase.database().ref("pengemudi/" + this.navigationProps.pengemudi.id_pengemudi + "/testimoni").on("value", (snapshot) => {
      let testimoni = [];
      for (let index in snapshot.val()) {
        let objTestimoni = snapshot.val()[index];
        firebase.database().ref("penumpang/" + snapshot.val()[index].id_penumpang).once("value").then((snapshot) => {
          objTestimoni.penumpang = snapshot.val();
          return objTestimoni;
        }).then((objTestimoni) => {
          testimoni.push(objTestimoni);
          return testimoni;
        }).then((testimoni) => {
          this.setState({testimoni});
        });
      }
    });
  }

  renderRow(rowData) {
    return (
      <ListItem>

        <Thumbnail size={80} source={{ uri: rowData.penumpang.foto || this.placehold }} />

        <Body>
        <Text>{rowData.penumpang.nama}</Text>
        <Text note>{rowData.tanggal}</Text>
        <Content style={styles.ratingContentList} padder>
          <StarRating
            disabled={true}
            maxStars={5}
            rating={rowData.rating}
            starColor={'#313131'}
            starSize={10}
          />
        </Content>
        <Text>{rowData.isi}</Text>
        </Body>

      </ListItem>
    );
  }

  render () {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={styles.container}>

          <Header noShadow>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="chevron-left" />
              </Button>
            </Left>
            <Body>
            <Title>Testimoni</Title>
            </Body>
          </Header>

          <Content padder>

            <Content style={styles.ratingContent}>
              <Text style={styles.ratingText}>Beri Rating</Text>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.rating}
                selectedStar={(rating) => this.setState({rating})}
                starColor={'#FFEB3B'}
                starSize={20}
              />
            </Content>

            <Form>
              <Item floatingLabel error={this.isFieldInError('testimoni ')}>
                <Label>Tuliskan Testimoni Anda</Label>
                <Input
                  style={styles.inputTestimoni}
                  multiline={true}
                  value={this.state['testimoni ']}
                  onChangeText={(text) => this.setState({'testimoni ': text})} />
              </Item>

              <ErrorLabel error={this.state.errors['testimoni ']} />
              <Button
                success
                block
                style={styles.buttonTestimoni}
                onPress={() => this.beriTestimoni()}>
                <Text>Beri Testimoni</Text>
              </Button>
            </Form>
            <List dataArray={this.state.testimoni} renderRow={(rowData) => this.renderRow(rowData)}></List>
          </Content>
        </Container>
      </StyleProvider>
    )
  }

}