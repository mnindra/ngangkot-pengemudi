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
        latitude: this.navigationProps.position.latitude,
        longitude: this.navigationProps.position.longitude
      },
      loading: false,
      ruteTerpilih: this.navigationProps.position.id_rute,
      overview_path: this.navigationProps.overview_path,
      pengemudi: [],
      penumpang: null,
      dekat: false,
      error: null
    };

    // buat status ngangkot di database
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("ngangkot/" + uid).set({
      id_penumpang: uid,
      lokasi: this.navigationProps.lokasiAwal
    });
  }

  componentDidMount() {
    // mencari lokasi geolocation
    this.mapRef.fitToElements(false);
    this.watchId = navigator.geolocation.watchPosition((position) => {
        this.setState({
          loading: false,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null
        });
      }, (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );

    // mencari pengemudi yang online
    firebase.database().ref("pengemudi").on("value", (snapshot) => {
      let pengemudi = [];
      for (let index in snapshot.val()) {
        let item = snapshot.val()[index];
        if(item.angkutan.id_rute == this.navigationProps.id_rute && item.online == 1) {
          pengemudi.push(item);
        }
      }
      this.setState({pengemudi});

      this.state.pengemudi.forEach((item) => {
        let pengemudiLat = item.lokasi.latitude;
        let pengemudiLon = item.lokasi.longitude;
        let awalLat = this.navigationProps.lokasiAwal.latitude;
        let awalLon = this.navigationProps.lokasiAwal.longitude;
        let jarak = this.getDistanceFromLatLonInKm(pengemudiLat, pengemudiLon, awalLat, awalLon);
        if(jarak < 0.5 && this.state.dekat === false) {
          Alert.alert("Angkot Sudah Dekat", "Angkot berada kurang dari 500 Meter");
          this.setState({dekat: true});
        }
      });
    });

    // ambil data penumpang
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("penumpang/" + uid).once("value").then((snapshot) => {
      this.setState({
        penumpang: snapshot.val()
      });
    });
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  profilPengemudi(pengemudi) {
    this.props.navigation.navigate('ProfilPengemudi', {pengemudi, penumpang: this.state.penumpang});
  }

  selesai () {
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("ngangkot/" + uid).remove();
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
              onMapReady={() => this.mapRef.fitToElements(false)}>

              {/* marker posisi */}
              <MapView.Marker
                coordinate={{latitude: this.state.position.latitude, longitude: this.state.position.longitude}}>
                <View style={styles.radius}>
                  <View style={styles.marker} />
                </View>
              </MapView.Marker>

              {/* marker titik tujuan */}
              <MapView.Marker
                pinColor={"#ff3f29"}
                coordinate={this.navigationProps.lokasiTujuan}
                title={'Lokasi Tujuan'}
                description={'lokasi yang ingin anda tuju'}
              />

              {/* marker titik awal */}
              <MapView.Marker
                pinColor={"#007AFF"}
                coordinate={this.navigationProps.lokasiAwal}
                title={'Lokasi Awal'}
                description={'lokasi dimana anda akan naik angkot'}
              />

              {/* jalur rute */}
              <MapView.Polyline
                coordinates={this.state.overview_path}
                strokeColor={'#709eff'}
                strokeWidth={3}/>

              {/* marker pengemudi */}
              {this.state.pengemudi.map(marker => (
                <MapView.Marker
                  pinColor={"#3e3e3e"}
                  key={marker.id_pengemudi}
                  coordinate={marker.lokasi}
                  title={marker.nama}
                  description={'sentuh untuk melihat profil pengemudi'}
                  onCalloutPress={() => { this.profilPengemudi(marker) }}>
                  <View style={styles.markerPengemudi}>
                    <Icon name="directions-car" style={styles.markerPengemudiIcon} />
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