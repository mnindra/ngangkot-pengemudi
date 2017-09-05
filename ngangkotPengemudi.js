import { StackNavigator } from 'react-navigation';
import Login from './app/screens/Login';
import Daftar from './app/screens/Daftar/index';
import FotoProfil from './app/screens/FotoProfil/index';
import Main from './app/screens/Main/index';
import UbahFoto from './app/screens/UbahFoto/index';
import UbahProfil from './app/screens/UbahProfil/index';
import UbahPassword from './app/screens/UbahPassword/index';
import ProfilPenumpang from './app/screens/ProfilPenumpang/index';
import LihatAngkutan from './app/screens/LihatAngkutan/index';
import LihatTestimoni from './app/screens/LihatTestimoni/index';
import RuangPercakapan from './app/screens/RuangPercakapan/index';
import MulaiNgangkot from "./app/screens/MulaiNgangkot/index";

console.ignoredYellowBox = [
  'Setting a timer'
];

const ngangkot = StackNavigator({
  Login: {screen: Login},
  Daftar: {screen: Daftar},
  FotoProfil: {screen: FotoProfil},
  Main: {screen: Main},
  UbahFoto: {screen: UbahFoto},
  UbahProfil: {screen: UbahProfil},
  UbahPassword: {screen: UbahPassword},
  ProfilPenumpang: {screen: ProfilPenumpang},
  LihatAngkutan: {screen: LihatAngkutan},
  LihatTestimoni: {screen: LihatTestimoni},
  RuangPercakapan: {screen: RuangPercakapan},
  MulaiNgangkot: {screen: MulaiNgangkot}
}, {
  headerMode: 'screen',
  navigationOptions: {
    header: false
  }
});

export default ngangkot;