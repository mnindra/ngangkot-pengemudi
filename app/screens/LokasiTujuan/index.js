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
  Right
} from 'native-base';
import {View, Alert} from  'react-native';
import getTheme from '../../../native-base-theme/components/index';
import material from '../../../native-base-theme/variables/material';
import firebase from '../../config/firebase';
import styles from './styles';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';

export default class LokasiTujuan extends Component {

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
      markers: [],
    };
  }

  componentDidMount() {
    this.mapRef.fitToElements(false);
    this.watchId = navigator.geolocation.watchPosition((position) => {
        this.setState({
          loading: false,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        });
      }, (error) => {
        Alert.alert('Peringatan', 'Lokasi tidak dapat ditemukan');
        this.setState({
          loading: false
        });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal({country: 'ID'}).then((place) => {
      let coordinate = {
        latitude: place.latitude,
        longitude: place.longitude
      };
      this.addMarker(coordinate);
      this.mapRef.fitToElements(true);
    }).catch(error => console.log(error.message));
  }

  addMarker(coordinate) {
    let markers = [];
    let id = Math.random().toString(36).substring(7);
    markers.push({key: id, latlng: coordinate});
    this.setState({markers});
  }

  selanjutnya () {
    if(this.state.markers.length > 0) {
      this.props.navigation.navigate('RuteAngkot', {
        lokasiAwal: this.navigationProps.lokasiAwal,
        lokasiTujuan: this.state.markers[0].latlng,
        position: this.state.position
      });
    } else {
      Alert.alert("Lokasi Tujuan", "Silahkan pilih lokasi tujuan");
    }
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
            <Title>Lokasi Tujuan</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.openSearchModal()}>
                <Icon name="search" />
              </Button>
            </Right>
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
              onMapReady={() => this.mapRef.fitToElements(false)}
              onPress={(event) => this.addMarker(event.nativeEvent.coordinate)}>

              {/* marker posisi */}
              <MapView.Marker
                coordinate={{latitude: this.state.position.latitude, longitude: this.state.position.longitude}}>
                <View style={styles.radius}>
                  <View style={styles.marker} />
                </View>
              </MapView.Marker>

              {/* marker titik tujuan */}
              {this.state.markers.map(marker => (
                <MapView.Marker
                  draggable
                  pinColor={"#ff3f29"}
                  key={marker.key}
                  coordinate={marker.latlng}
                  title={'Lokasi Tujuan'}
                  description={'lokasi yang ingin anda tuju'}
                />
              ))}

              {/* marker titik awal */}
              <MapView.Marker
                pinColor={"#007AFF"}
                coordinate={this.navigationProps.lokasiAwal}
                title={'Lokasi Awal'}
                description={'lokasi dimana anda akan naik angkot'}
              />

            </MapView>
            <Text>{ this.state.loading ? 'mencari lokasi saat ini...' : '' }</Text>
            <Text style={styles.textHint}>Sentuh peta untuk menentukan lokasi tujuan</Text>
          </View>

          <Button
            success
            block
            onPress={() => this.selanjutnya()}>
          <Text>Selanjutnya</Text>
          </Button>
        </Container>
      </StyleProvider>
    );
  }
}