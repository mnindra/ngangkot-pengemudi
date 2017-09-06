import React, { Component } from 'react';
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
  Header,
  Left,
  Body,
  Title,
  Form,
  Picker,
  Item,
  Label,
  List,
  ListItem,
  Right
} from 'native-base';
import {View, Alert} from  'react-native';
import getTheme from '../../../native-base-theme/components/index';
import material from '../../../native-base-theme/variables/material';
import firebase from '../../config/firebase';
import styles from './styles';
import MapView from 'react-native-maps';

export default class MulaiNgangkot extends Component {

  constructor(props) {
    super(props);
    this.mapRef = null;
    this.navigationProps = this.props.navigation.state.params;

    this.state = {
      position: {
        latitude: -7.9477,
        longitude: 112.6163
      },
      loading: true,
      ruteTerpilih: this.navigationProps.pengemudi.angkutan.id_rute,
      overview_path: this.navigationProps.overview_path,
      penumpang: [],
      error: null
    };
  }

  componentDidMount() {
    // mencari lokasi geolocation
    this.watchId = navigator.geolocation.watchPosition((position) => {
        this.setState({
          loading: false,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null
        });
        this.mapRef.fitToElements(true);
      }, (error) => {
      this.setState({ error: error.message, loading: false });
      Alert.alert("lokasi tidak ditemukan", "Pastikan anda menghidupkan GPS");
      this.mapRef.fitToElements(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );

    // mencari penumpang di rute tersebut
    firebase.database().ref("rute/" + this.state.ruteTerpilih + "/penumpang").on("value", (snapshot) =>{
      let penumpang = [];
      for (let index in snapshot.val()) {
        let item = snapshot.val()[index];
        // ambil informasi penumpang
        firebase.database().ref("penumpang/" + item.id_penumpang).once("value").then((snapshot) => {
          item.dataPenumpang = snapshot.val();
          penumpang.push(item);
          this.setState({penumpang: penumpang});
        });
      }
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  profilPenumpang(penumpang) {
    this.props.navigation.navigate('ProfilPenumpang', {pengemudi: this.navigationProps.pengemudi, penumpang});
  }

  selesai () {
    this.props.navigation.navigate('Main');
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
            <Title>Ngangkot</Title>
            </Body>
          </Header>

          <View style={styles.mapContainer}>
            <MapView
              ref={(ref) => this.mapRef = ref }
              initialRegion={{
                latitude: -7.958696250180737,
                longitude: 122.64232739806175,
                latitudeDelta: 0.11209798401417004,
                longitudeDelta: 0.13812806457281113,
              }}
              style={styles.map}
              onMapReady={() => this.mapRef.fitToElements(true)}>

              {/* marker posisi */}
              <MapView.Marker
                coordinate={{latitude: this.state.position.latitude, longitude: this.state.position.longitude}}>
                <View style={styles.radius}>
                  <View style={styles.marker} />
                </View>
              </MapView.Marker>

              {/* jalur rute */}
              <MapView.Polyline
                coordinates={this.state.overview_path}
                strokeColor={'#709eff'}
                strokeWidth={3}/>

              {/* marker penumpang */}
              {this.state.penumpang.map(marker => (
                <MapView.Marker
                  pinColor={"#3e3e3e"}
                  key={marker.id_penumpang}
                  coordinate={marker.lokasi}
                  title={marker.dataPenumpang.nama}
                  description={'sentuh untuk melihat profil penumpang'}
                  onCalloutPress={() => { this.profilPenumpang(marker.dataPenumpang) }}>
                  <View style={styles.markerPenumpang}>
                    <Icon name="person" style={styles.markerPenumpangIcon} />
                  </View>
                </MapView.Marker>
              ))}

            </MapView>
            <Text>{ this.state.loading ? 'mencari lokasi saat ini...' : '' }</Text>
          </View>

          <Button
            success
            block
            onPress={() => this.selesai()}>
            <Text>Selesai</Text>
          </Button>
        </Container>
      </StyleProvider>
    );
  }
}