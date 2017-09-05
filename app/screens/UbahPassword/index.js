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
  Title
} from 'native-base';
import { StyleSheet, Alert } from 'react-native';
import ErrorLabel from '../../components/ErrorLabel';
import getTheme from '../../../native-base-theme/components/index';
import material from '../../../native-base-theme/variables/material';
import firebase from '../../config/firebase';
import styles from './styles';

export default class UbahPassword extends ValidationComponent {

  constructor (props) {
    super(props);
    this.state = {
      'password lama': '',
      'password baru': '',
      'konfirmasi password': '',
      errors: {}
    }
  }

  periksaPassword() {
    return firebase.database().ref("penumpang/" + this.props.navigation.state.params.user.id_penumpang).once("value").then((snapshot) => {
      if (snapshot.val().password == this.state['password lama']) {
        return true;
      } else {
        return false;
      }
    });
  }

  ubah () {
    this.validasiForm();

    if(!this.isFormValid()) {
      return 0;
    }

    if(!this.periksaPassword()) {
      this.setState({
        'password lama': '',
        'password baru': '',
        'konfirmasi password': '',
        errors: {
          'password lama': 'password lama salah'
        }
      });
      return 0;
    }

    if(this.state['password baru'] != this.state['konfirmasi password']) {
      this.setState({
        'password lama': '',
        'password baru': '',
        'konfirmasi password': '',
        errors: {
          'konfirmasi password': 'konfirmasi password salah'
        }
      });

      return 0;
    }

    if (this.isFormValid()) {
      firebase.database().ref('penumpang/' + this.props.navigation.state.params.user.id_penumpang).update({
        password: this.state['password baru'],
      }).then(() => {
        return firebase.auth().currentUser.updatePassword(this.state['password baru']);
      }).then(() => {
        this.props.navigation.navigate('Main', {activeTab: 'profil'});
      }).catch((error) => {
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
      'password lama': {required: true, minlength: 6},
      'password baru': {required: true, minlength: 6},
      'konfirmasi password': {required: true, minlength: 6},
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

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={styles.container}>

          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="chevron-left" />
              </Button>
            </Left>
            <Body>
            <Title>Ubah Password</Title>
            </Body>
          </Header>

          <Content padder>
            <Form style={styles.form}>
              <Item floatingLabel error={this.isFieldInError('password lama')}>
                <Icon name="lock" style={styles.formIcon}/>
                <Input
                  placeholder="Password Lama"
                  value={this.state['password lama']}
                  onChangeText={(text) => this.setState({'password lama': text})}
                  secureTextEntry={true}/>
              </Item>
              <ErrorLabel error={this.state.errors['password lama']} />

              <Item floatingLabel error={this.isFieldInError('password baru')}>
                <Icon name="lock" style={styles.formIcon}/>
                <Input
                  placeholder="Password Baru"
                  value={this.state['password baru']}
                  onChangeText={(text) => this.setState({'password baru': text})}
                  secureTextEntry={true}/>
              </Item>
              <ErrorLabel error={this.state.errors['password baru']} />

              <Item floatingLabel error={this.isFieldInError('konfirmasi password')}>
                <Icon name="lock" style={styles.formIcon}/>
                <Input
                  placeholder="Konfirmasi Password"
                  value={this.state['konfirmasi password']}
                  onChangeText={(text) => this.setState({'konfirmasi password': text})}
                  secureTextEntry={true}/>
              </Item>
              <ErrorLabel error={this.state.errors['konfirmasi password']} />
            </Form>
          </Content>

          <Button
            success
            block
            onPress={() => this.ubah()}>
            <Text>Simpan</Text>
          </Button>
        </Container>
      </StyleProvider>
    );
  }
}