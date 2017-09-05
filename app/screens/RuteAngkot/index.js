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

export default class RuteAngkot extends Component {

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
      search: true,
      rute: [],
      ruteTerpilih: "",
      overview_path: [],
      error: null
    };

    //  mengambil semua data rute
    firebase.database().ref("rute").once("value").then((snapshot) => {
      let rute = [];
      for (let index in snapshot.val()) {
        rute.push(snapshot.val()[index]);
      }
      this.setState({rute});

      // mencari rute terdekat dari titik tujuan
      let latTujuan = this.navigationProps.lokasiTujuan.latitude;
      let lonTujuan = this.navigationProps.lokasiTujuan.longitude;
      let ruteDekat = [];
      this.state.rute.forEach((item) => {
        let overview_path = item.rute.routes[0].overview_path;
        let dekat = false;

        for(let index in overview_path) {
          let latRute = overview_path[index].lat;
          let lonRute = overview_path[index].lng;
          let jarak = this.getDistanceFromLatLonInKm(latTujuan, lonTujuan, latRute, lonRute);
          if(jarak < 1.5) {
            dekat = true;
            break;
          }
        }

        if(dekat) {
          ruteDekat.push(item);
        }
      });

      // mencari rute terdekat dari titik awal
      let latAwal = this.navigationProps.lokasiAwal.latitude;
      let lonAwal = this.navigationProps.lokasiAwal.longitude;
      let ruteDekat2 = [];
      ruteDekat.forEach((item) => {
        let overview_path = item.rute.routes[0].overview_path;
        let dekat = false;

        for(let index in overview_path) {
          let latRute = overview_path[index].lat;
          let lonRute = overview_path[index].lng;
          let jarak = this.getDistanceFromLatLonInKm(latAwal, lonAwal, latRute, lonRute);
          if(jarak < 1) {
            dekat = true;
            break;
          }
        }

        if(dekat) {
          ruteDekat2.push(item);
        }
      });

      // kembali apabila tidak ada rute yang ditemukan
      if(!ruteDekat2.length > 0) {
        Alert.alert("Rute Angkot", "Tidak ditemukan rute angkot yang sesuai, silahkan ubah lokasi awal dan tujuan anda");
        this.props.navigation.navigate("Main");
        return 0;
      }

      // simpan rute yang dekat ke state
      let overview_path = [];
      for(let index in ruteDekat2[0].rute.routes[0].overview_path) {
        let latitude = ruteDekat2[0].rute.routes[0].overview_path[index].lat;
        let longitude = ruteDekat2[0].rute.routes[0].overview_path[index].lng;
        overview_path.push({latitude, longitude});
      }

      this.setState({
        search: false,
        rute: ruteDekat2,
        ruteTerpilih: ruteDekat2[0].id_rute,
        overview_path: overview_path
      });
      this.mapRef.fitToElements(false);
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

  setRute(id_rute, indexItem) {
    let overview_path = [];
    for(let index in this.state.rute[indexItem].rute.routes[0].overview_path) {
      let latitude = this.state.rute[indexItem].rute.routes[0].overview_path[index].lat;
      let longitude = this.state.rute[indexItem].rute.routes[0].overview_path[index].lng;
      overview_path.push({latitude, longitude});
    }

    this.setState({
      ruteTerpilih: id_rute,
      overview_path: overview_path
    });
    this.mapRef.fitToElements(true);
  }

  ngangkot () {
      this.props.navigation.navigate('MulaiNgangkot', {
        lokasiAwal: this.navigationProps.lokasiAwal,
        lokasiTujuan: this.navigationProps.lokasiTujuan,
        position: this.state.position,
        overview_path: this.state.overview_path,
        id_rute: this.state.ruteTerpilih
      });
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
            <Title>Pilih Rute Angkot</Title>
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

            </MapView>
            <Text>{ this.state.search ? 'mencari rute angkot yang cocok...' : '' }</Text>
            <Text>{ this.state.loading ? 'mencari lokasi saat ini...' : '' }</Text>
          </View>

          <Content style={styles.pickerContainer} padder>
            <Label>Pilih Rute Angkot</Label>
            <Picker
              selectedValue={this.state.ruteTerpilih}
              onValueChange={(value, index) => this.setRute(value, index)}
              mode="dropdown">
              {this.state.rute.map(rute => (
                <Item key={Math.random().toString(36).substring(7)} label={rute.id_rute} value={rute.id_rute} />
              ))}
            </Picker>
          </Content>

          <Button
            success
            block
            onPress={() => this.ngangkot()}>
            <Text>Ngangkot</Text>
          </Button>
        </Container>
      </StyleProvider>
    );
  }
}