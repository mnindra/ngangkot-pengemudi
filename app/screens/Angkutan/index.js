import React from 'react';
import {
  Container,
  Content,
  Button,
  Text,
  Card,
  H2,
  Icon,
  Grid,
  Col,
  StyleProvider,
  Form,
  Item,
  Input,
  Picker,
  Label
} from 'native-base';
import { Image, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
import firebase from '../../config/firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import styles from './styles';
import ValidationComponent from 'react-native-form-validator';
import ErrorLabel from '../../components/ErrorLabel';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Angkutan extends ValidationComponent {

  constructor(props) {
    super(props);
    this.state = {
      loadingAnimation: false,
      image: '',
      imagePath: 'http://via.placeholder.com/300x300',
      'nomor angkutan': "",
      id_rute: "",
      rute: [],
      errors: {}
    };

    // ambil data semua rute
    firebase.database().ref("rute").once("value").then((snapshot) => {
      let rute = [];
      for (let index in snapshot.val()) {
        rute.push(snapshot.val()[index]);
      }
      this.setState({
        rute,
        id_rute: rute[0].id_rute
      });
    });
  }

  setRute(id_rute) {
    this.setState({id_rute});
  }

  BukaGaleri () {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropperActiveWidgetColor: '#484fff',
      cropperToolbarColor: '#5b82ff',
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true
    }).then(image => {
      this.setState({
        image: image.data,
        imagePath: image.path
      });
    }).catch((error) => {

    });
  }

  BukaCamera () {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true
    }).then(image => {
      this.setState({
        image: image.data,
        imagePath: image.path
      });
    }).catch((error) => {

    });
  }

  UploadFoto() {
    if (this.state.image == '') {
      this.setState({loadingAnimation:false});
      Alert.alert("Data Angkutan", "Pilih foto angkutan terlebih dahulu");
    } else {
      const Blob = RNFetchBlob.polyfill.Blob;
      const fs = RNFetchBlob.fs;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;

      let uid = firebase.auth().currentUser.uid;
      const imageRef = firebase.storage().ref("angkutan/" + uid + ".jpg");
      let mime = 'image/jpg';
      fs.readFile(this.state.imagePath, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`})
      }).then((blob) => {
        return imageRef.put(blob, { contentType: mime })
      }).then(() => {
        return imageRef.getDownloadURL();
      }).then((url) => {
        firebase.database().ref('pengemudi/' + uid + '/angkutan').update({foto: url});
        this.setState({loadingAnimation:false});
        this.props.navigation.navigate('Main');
      }).catch((error) => {
        this.setState({loadingAnimation:false});
        console.log(error);
      });
    }
  }

  simpan () {
    this.validasiForm();

    if (!this.isFormValid()) {
      return 0;
    }

    if (this.state.image == '') {
      Alert.alert("Data Angkutan", "Pilih foto angkutan terlebih dahulu");
      return 0;
    }

    if (this.isFormValid()) {
      this.setState({loadingAnimation:true});
      let uid = firebase.auth().currentUser.uid;
      firebase.database().ref("pengemudi/" + uid + "/angkutan").set({
        no_angkutan: this.state['nomor angkutan'],
        id_rute: this.state.id_rute
      }).then(() => {
        this.UploadFoto();
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

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={styles.container}>
          <Content padder>

            <H2 style={styles.title}>Data Angkutan</H2>

            <Card>
              <Content padder>
                <Text style={styles.formText}>Masukkan Data Angkutan</Text>
                <Image style={styles.image} source={{ isStatic:true, uri:this.state.imagePath }} />
                <Grid>
                  <Col style={{paddingRight: 5}}>
                    <Button
                      danger
                      block
                      bordered
                      iconLeft
                      onPress={() => this.BukaCamera()}>
                      <Icon name="photo-camera" />
                      <Text>Kamera</Text>
                    </Button>
                  </Col>
                  <Col style={{paddingLeft: 5}}>
                    <Button
                      success
                      block
                      bordered
                      iconLeft
                      onPress={() => this.BukaGaleri()}>
                      <Icon name="collections" />
                      <Text>Galeri</Text>
                    </Button>
                  </Col>
                </Grid>
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

                <Button
                  primary
                  block
                  onPress={() => this.simpan()}>
                  <Text>Simpan</Text>
                </Button>

              </Content>
            </Card>
          </Content>
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