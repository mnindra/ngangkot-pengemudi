import React from 'react';
import ValidationComponent from 'react-native-form-validator';
import {
  Container,
  Content,
  Button,
  Text,
  Form,
  Item,
  Input,
  Card,
  H2,
  Icon,
  StyleProvider,
  Header,
  Left,
  Body,
  Title,
  Label,
  Picker
} from 'native-base';
import { Alert } from 'react-native';
import ErrorLabel from '../../components/ErrorLabel';
import getTheme from '../../../native-base-theme/components/index';
import material from '../../../native-base-theme/variables/material';
import firebase from '../../config/firebase';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';

export default class UbahAngkutan extends ValidationComponent {

  constructor (props) {
    super(props);
    this.navigationProps = this.props.navigation.state.params;
    this.state = {
      loadingAnimation: false,
      'nomor angkutan': this.navigationProps.angkutan.no_angkutan,
      id_rute: this.navigationProps.angkutan.id_rute,
      rute: [],
      errors: {}
    };

    // ambil data semua rute
    firebase.database().ref("rute").once("value").then((snapshot) => {
      let rute = [];
      for (let index in snapshot.val()) {
        rute.push(snapshot.val()[index]);
      }
      this.setState({rute});
    });
  }

  ubah () {
    this.validasiForm();
    if (this.isFormValid()) {
      this.setState({loadingAnimation: true});
      let uid = firebase.auth().currentUser.uid;
      firebase.database().ref('pengemudi/' + uid + '/angkutan').update({
        no_angkutan: this.state['nomor angkutan'],
        id_rute: this.state.id_rute
      }).then(() => {
        let angkutan = this.navigationProps.angkutan;
        angkutan.no_angkutan = this.state['nomor angkutan'];
        angkutan.id_rute = this.state.id_rute;
        this.setState({loadingAnimation: false});
        this.props.navigation.navigate('LihatAngkutan', {angkutan: angkutan, pengemudi: this.navigationProps.pengemudi});
      }).catch((error) => {
        this.setState({loadingAnimation: false});
        switch (error.code) {
          case "auth/network-request-failed":
            Alert.alert("Koneksi Gagal", "Cek koneksi internet anda");
            break;
          default:
            Alert.alert("Terjadi Kesalahan", "Kesalahan tidak diketahui");
        }
      });
    }
  }

  validasiForm() {
    this.validate({
      'nomor angkutan': {required: true},
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

  setRute(id_rute) {
    this.setState({id_rute});
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={{ backgroundColor: '#fff' }}>

          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="chevron-left" />
              </Button>
            </Left>
            <Body>
            <Title>Ubah Data Angkutan</Title>
            </Body>
          </Header>
          <Content padder>
            <Form style={styles.form}>
              <Item floatingLabel error={this.isFieldInError('nomor angkutan')} style={styles.formItem}>
                <Icon name="directions-car" style={styles.formIcon}/>
                <Input
                  placeholder="Nomor Angkutan"
                  value={this.state['nomor angkutan']}
                  onChangeText={(text) => this.setState({'nomor angkutan': text})}/>
              </Item>
              <ErrorLabel error={this.state.errors['nomor angkutan']} />

              <Label style={styles.formLabel}>Pilih Rute Angkot</Label>
              <Picker
                style={styles.formPicker}
                selectedValue={this.state.id_rute}
                onValueChange={(value) => this.setRute(value)}
                mode="dropdown">
                {this.state.rute.map(rute => (
                  <Item key={rute.id_rute} label={rute.id_rute} value={rute.id_rute} />
                ))}
              </Picker>
            </Form>
          </Content>

          <Button
            success
            block
            onPress={() => this.ubah()}>
            <Text>Simpan</Text>
          </Button>
          <Spinner
            visible={this.state.loadingAnimation}
            textContent={"Menyimpan data angkutan..."}
            textStyle={{color: '#FFF'}}
            overlayColor={"#00BCD4"}/>
        </Container>
      </StyleProvider>
    );
  }
}