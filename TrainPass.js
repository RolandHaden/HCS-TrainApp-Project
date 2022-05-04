

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import * as React from 'react';
import QRCode from 'react-native-qrcode-svg';
function TrainPassScreen(){
    return(
        <View style={styles.container}>
            <QRCode
                value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                size={200}
                bgColor='black'
                fgColor='white'
                
            />
            <TouchableOpacity 
                style={styles.buttonview}
                onPress={() => {Linking.openURL('shoebox://')}}
            >
                <Image source={require('./assets/atawl.png')}  style={styles.button}/>
            </TouchableOpacity>
        </View>
    );
}
export default TrainPassScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly', 
    },
    buttonview: {
    },
    button: {
        width: 350/2,
        height: 108/2,
    },
});