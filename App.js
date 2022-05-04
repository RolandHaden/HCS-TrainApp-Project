/*
  Author: Davis Haden
  Title: GHP Train App Prototype.
  Last Date Edited: 4-22-2022
*/
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  VirtualizedList,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {useState, useEffect} from "react";
import * as React from 'react';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from '@expo/vector-icons'; //https://icons.expo.fyi/
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {authentication} from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import TrainPassScreen from "./TrainPass";


//Importing Marta API
let DATA = [];
let FAVORITES = [];

function addFav (train){
  //removeTrainDuplicates();
  //adds object to FAVORITES if trainid containes matching DESTINATION and STATION PROPERTIES
  /*for (let i = 0; i < DATA.length; i++) {
    if (DATA[i].TRAIN_ID === trainid.DESTIN) {
      const temp = {
        id: i,
        label: DATA[i].TRAIN_ID,
      };
      FAVORITES.push(temp);
      console.log(DATA[i].DESTINATION + "AND" + DATA[i].STATION);
    }
  }*/
  FAVORITES.push(train);
  //console.log(temp);
  
}

function remFav (trainid){
  console.log("REMOVING " + trainid.id);
  for (let i = 0; i < FAVORITES.length; i++) {
    if (FAVORITES[i].id === trainid.id) {
      FAVORITES.splice(i, 1);
    }
  }
}

//length of FAVORITES
const getFavLength = (data) => {
  return FAVORITES.length;
}

const getFavorite = (data, index) => {
  if (FAVORITES) {
    return {
      id: index,
      line: FAVORITES[index].line,
      station: FAVORITES[index].station,
      title: FAVORITES[index].title,
    };
  } else {
    return {
      id: index,
      title: "nothing here",
    };
  };
};

const UsingFetch = () => {
  const [users, setUsers] = useState([]);

  const fetchData = () => {
    fetch(
      "http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey=40ac4dc9-9224-4578-80fd-bd05ceb1095a"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  fetchData();

  users.forEach((train) => {
      DATA.push(train);
  });
};



function removeTrainDuplicates() {
  if (DATA) {
    for (let i = 0; i < DATA.length; i++) {
      for (let j = 0; i < DATA.length; i++) {
        if (DATA[i].TRAIN_ID === DATA[j].TRAIN_ID) {
          DATA.pop(j);
          console.log(DATA.length);
        }
      }
    }
  } else {
  }
}

const getItem = (data, index) => {
  //removeTrainDuplicates(DATA);
  if (DATA) {
    return {
      id: index,
      trainid: DATA[index].TRAIN_ID,
      title: DATA[index].DESTINATION,
      line: DATA[index].LINE,
      station: DATA[index].STATION,
      waitingTime: DATA[index].WAITING_TIME,
    };
  } else {
    return {
      id: index,
      title: "nothing here",
    };
  }
};

const getItemCount = (data) => {
  return DATA.length;
};

const Item = ({ title, id, line, station, waitingTime, originid }) => {
  //<Text style={styles.textDetails}>Train ID: {id} | </Text>
  return (
    <BusBlock 
      title={title}
      id={originid}
      line={line}
      station={station}
    />
  );
};

class UserProfile{
  constructor(email, password){
      this.email = email;
      this.password = password
  }
  getEmail(){
    console.log(this.email);
  }
  getPassword(){
      console.log(this.password);
  }
}

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalLoginVisible, setModalLoginVisible] = useState(true);
  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, username, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        //alert("Signed in as " + user.email);
        navigation.navigate('Home');
        setModalLoginVisible(!modalLoginVisible);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
  const handleSignup = () => {
    createUserWithEmailAndPassword(authentication, username, password)
      .then((userCredential) => {
        signInWithEmailAndPassword(authentication, username, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        //alert("Signed in as " + user.email);
        navigation.navigate('Home');
        setModalLoginVisible(!modalLoginVisible);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
  }

  return (
    <Modal 
    animationType="slide" 
    visible = {modalLoginVisible}
    presentationStyle="formSheet"
    onRequestClose={() => {
      Alert.alert("Modal has been closed.");
      setModalLoginVisible(!modalLoginVisible);
    }}
    >
    <KeyboardAwareScrollView
      style={styles.ScrollContainer}
      contentContainerStyle={{ flex: 1 }}
      scrollEnabled={false}
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Image
          source={require("./assets/login-vector.png")}
          style={styles.LoginVector}
        />
        <View style={styles.headingText}>
          <Text style={styles.h1}>Login</Text>
        </View>
        <View style={styles.headingText}>
          <Text style={styles.h2}>
            Please login to your account or sign up to continue.
          </Text>
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#ffffff"
            color="#ffffff"
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#ffffff"
            color="#ffffff"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.buttonView}>
          <Button
            style={styles.SubmitButton}
            title="Submit"
            color="#ffffff"
            accessibilityLabel="Click to submit user information."
            //onPress={() => {setModalVisible(!modalVisible); navigation.navigate('Home');}}
            onPress={() => handleLogin()}
          />
          
        </View>
        <View style={styles.buttonViewSignUp}>
        <Button
            style={styles.SubmitButton}
            title="Sign Up"
            color="#fd5e53"
            accessibilityLabel="Click to sign up."
            onPress={() => handleSignup()}
          />
          </View>
      </View>
    </KeyboardAwareScrollView>
    </Modal>
  );
}
/*
<Button 
            title = "More Details" 
            color="#ffffff"
            onPress={() => setModalVisible(!modalVisible)}
          />
*/

const MapMarkers = (props) => {
  return DATA.map((train, index) => {
    let color = require("./assets/busorange.png");
    let coord = {
      latitude: 33.7490,
      longitude: -84.3880,};
    if(train.STATION === "DORAVILLE STATION"){
      coord = {//33.903039452172735, -84.28016705613395
        latitude: 33.903039452172735,
        longitude: -84.28016705613395,
      }
    }else if(train.STATION === "CHAMBLEE STATION"){
      coord = {//33.88674836546864, -84.30753601849963
        latitude: 33.88674836546864,
        longitude: -84.30753601849963,
      }
    }else if(train.STATION === "CHAMBLEE STATION"){
      coord = {//33.88674836546864, -84.30753601849963
        latitude: 33.88674836546864,
        longitude: -84.30753601849963,
      }
    }else if(train.STATION === "BROOKHAVEN STATION"){
      coord = {//33.860011455647275, -84.33935454575033
        latitude: 33.860011455647275,
        longitude: -84.33935454575033,
      }
    }else if(train.STATION === "LENOX STATION"){
      coord = {//33.845099860558335, -84.35866816989808
        latitude: 33.845099860558335,
        longitude: -84.35866816989808,
      }
    }else if(train.STATION === "LINDBERGH STATION"){
      coord = {//33.82316744463901, -84.36938247285833
        latitude: 33.82316744463901,
        longitude: -84.36938247285833,
      }
    }else if(train.STATION === "ARTS CENTER STATION"){
      coord = {//33.789260696011276, -84.38733939850911
        latitude: 33.789260696011276,
        longitude: -84.38733939850911,
      }
    }else if(train.STATION === "MIDTOWN STATION"){
      coord = {//33.78112347918134, -84.38634301692625
        latitude: 33.78112347918134,
        longitude: -84.38634301692625,
      }
    }else if(train.STATION === "NORTH AVE STATION"){
      coord = {//33.77169969819383, -84.38704064324729
        latitude: 33.77169969819383,
        longitude: -84.38704064324729,
      }
    }else if(train.STATION === "CIVIC CENTER STATION"){
      coord = {//33.7665762143755, -84.38734716325372
        latitude: 33.7665762143755,
        longitude: -84.38734716325372,
      }
    }else if(train.STATION === "PEACHTREE CENTER STATION"){
      coord = {//33.75799200342163, -84.3878178401968
        latitude: 33.757992003421635,
        longitude: -84.3878178401968,
      }
    }else if(train.STATION === "FIVE POINTS STATION"){
      coord = {//33.75384330192655, -84.39153416289383
        latitude: 33.75384330192655,
        longitude: -84.39153416289383,
      }
    }else if(train.STATION === "GARNETT STATION"){
      coord = {//33.74844611933688, -84.39593852131
        latitude: 33.74844611933688,
        longitude: -84.39593852131,
      }
    }else if(train.STATION === "WEST END STATION"){
      coord = {//33.73600214138496, -84.41372684751023
        latitude: 33.73600214138496,
        longitude: -84.41372684751023,
      }
    }else if(train.STATION === "OAKLAND CITY STATION"){
      coord = {//33.716956285727285, -84.42514932899338
        latitude: 33.716956285727285,
        longitude: -84.42514932899338,
      }
    }else if(train.STATION === "LAKEWOOD STATION"){
      coord = {//33.700496089007935, -84.42885635010825
        latitude: 33.7004960890079355,
        longitude: -84.42885635010825,
      }
    }else if(train.STATION === "EAST POINT STATION"){
      coord = {//33.67755788484411, -84.4405205391624
        latitude: 33.67755788484411,
        longitude: -84.4405205391624,
      }
    }else if(train.STATION === "COLLEGE PARK STATION"){
      coord = {//33.651646956353545, -84.44878689641217
        latitude: 33.651646956353545,
        longitude: -84.44878689641217,
      }
    }else if(train.STATION === "AIRPORT STATION"){
      coord = {//33.64085009735662, -84.4462285008038
        latitude: 33.64085009735662,
        longitude: -84.4462285008038,
      }
    }else if(train.STATION === "NORTH SPRINGS STATION"){
      coord = {//33.94502048468645, -84.35720767113442
        latitude: 33.9450204846864,
        longitude: -84.35720767113442,
      }
    };
    
    if(train.LINE === "BLUE"){
      color = require("./assets/busblue.png");
    }else if (train.LINE === "RED"){
      color = require("./assets/busred.png");
    }else if (train.LINE === "GREEN"){
      color = require("./assets/busgreen.png");
    }else if (train.LINE === "GOLD"){
      color = require("./assets/busorange.png");
    };

    //console.log(markers.length);
    return (
      <Marker
        key = {index}
        pinColor= {color}
        coordinate={coord}
        title={train.STATION + " " + train.WAITING_TIME}
      >
      <Image style={{width:100, height:100}} source={color}/>
      </Marker>
    );
  });
}
const MapRender = (props) => {
  return(
    <MapMarkers/>
  );
}

function MapScreen({navigation}) {
  function clearList() {
    DATA = [];
  }
  clearList();
  UsingFetch();
  //console.log(DATA);
  //console.log(getItemCount);
  //removeTrainDuplicates();
  return (
    <View style={styles.mapContainer}>
      <MapView 
        style={styles.map}
        //scrollEnabled = {false}
        //rotateEnabled = {false}
        initialRegion={{
          latitude: 33.7490,
          longitude: -84.3880,
          latitudeDelta: 0.5922,
          longitudeDelta: 0.0421,
        }}
        >
          <Marker
              pinColor="blue"
              coordinate={{
                  latitude: 33.7490,
                  longitude: -84.3880,
                }}
          >
            <Image style={{width:100, height:100}} source={require("./assets/busorange.png")}/>
          </Marker>
          <MapRender/>
          </MapView>
      <View style={styles.scrollView}>
        <VirtualizedList
          data={DATA}
          initialNumToRender={4}
          maxNumToRender={5}
          horizontal={true}
          //style={styles.scrollView}
          renderItem={({ item, id }) => (
            <Item
              title={item.title}
              id={item.trainid}
              originid={item.id}
              line={item.line}
              station={item.station}
              waitingTime={item.waitingTime}
            />
          )}
          keyExtractor={(item) => item.id}
          getItemCount={getItemCount}
          getItem={getItem}
        />
        </View>
      
    </View>
  );
}

const BusBlock = (prop) =>{
  const [modalVisible, setModalVisible] = useState(false);
  const [heartState, setHeartState] = useState("heart-outline");
  const [heartColor, setHeartColor] = useState("black");

  let color = require("./assets/busorange.png");
  if(prop.line === "BLUE"){
    color = require("./assets/busblue.png");
  }else if (prop.line === "RED"){
    color = require("./assets/busred.png");
  }else if (prop.line === "GREEN"){
    color = require("./assets/busgreen.png");
  }else if (prop.line === "GOLD"){
    color = require("./assets/busorange.png");
  }
  return(
    <View style={styles.trainBlock} >
          <Image style={styles.trainIcon} source={color}/>
          <TouchableOpacity onPress={() => {
            if(heartState === "heart-outline"){
              setHeartState("heart-sharp"); setHeartColor("red");
              addFav(prop);
              console.log(prop);
              console.log(FAVORITES);
            }else{
              setHeartState("heart-outline"); setHeartColor("black");
              remFav(prop);
            }
            }}>
            <Ionicons name={heartState} size={30} color={heartColor} />
          </TouchableOpacity>
          <Text style={{fontSize: RFValue(13), textAlign: "center"}}>{prop.station}</Text>
          <Text style={{fontSize: RFValue(12), textAlign: "center"}}>Going to {prop.title}</Text>
          <View style={styles.viewMoreButton} style={{marginBottom:10}}>
          <Pressable 
            style={styles.viewMoreButton} 
            onPress={() => setModalVisible(!modalVisible)}
            >
            <Text style={{ fontSize: 15, color: '#ffffff' }}>More Details</Text>
          </Pressable>
          </View>
          <Modal
            animationType="slide" 
            visible = {modalVisible}
            presentationStyle="formSheet"
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
          }}>
            <View style = {styles.ClosetoTheRight}>
                <Button 
                title="Close Details"
                onPress={() => {setModalVisible(!modalVisible);}}
                />
              </View>
            <View style = {styles.singleTrainView}>
              <Image style={styles.trainDetailIcon} source={color}/>
              <Text style={styles.h1} style={{fontSize: RFValue(20)}}>{prop.station} ➔ {prop.title}</Text>
            </View>
          </Modal>
        </View>
  );
}

const FavoriteItem = (prop) =>{
  console.log("item has been rendered");
  return(
      <View style={styles.favoriteItem}>
        <Text style={styles.favStation}>{prop.station}</Text>
        <Text style={styles.favLine}>Line: {prop.line}</Text>
      </View>
  )
}

function TrainScreen({navigation}) {
  console.log(FAVORITES);
  return (
    <View style={styles.favContainer}>
      <VirtualizedList
        data={FAVORITES}
        renderItem={({ item, id }) => (
          <FavoriteItem
           station={item.station}
           line={item.line}
          />
        )}
        keyExtractor={(item) => item.id}
        getItemCount={getFavLength}
        getItem={getFavorite}
        style={{padding: 10, paddingVertical: 10}}
      />
    </View>
  );
}

const SpecificView = (prop) => {
  if (prop.name === 'MyTrain'){
    return (
      <View>
        <Text>Nothing to see here!</Text>
      </View>
    );
  }else if(prop.name === 'Train Pass'){
    return (
      <View>
        <TrainPassScreen/>
      </View>
    );
  }else{
    return <View><Text>Nothing to see here!</Text></View>
  }
}

const ProfileButton = (prop) => {
  const [modalVisible, setModalVisible] = useState(false);
  if(prop.name != 'Log Out'){
    return(
      <View style={styles.profileButton}>
          <Button 
          title = {prop.name}
          color="white"
          onPress={() => {setModalVisible(!modalVisible);}}
          />
          <Modal
              animationType="slide" 
              visible = {modalVisible}
              presentationStyle="formSheet"
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
            }}>
              <View style = {styles.ClosetoTheRight}>
                  <Button 
                  title={'Close ' + prop.name}
                  onPress={() => {setModalVisible(!modalVisible);}}
                  />
                </View>
              <View style = {styles.profileSubView}>
                <Text style={styles.h1}>{prop.name}</Text>
                <SpecificView name = {prop.name}/>
              </View>
              
            </Modal>
        </View>
    );
  }
  else{
    return(
      <View style={styles.profileButton}>
          <Button 
          title = {prop.name}
          color="white"
          onPress={() => {
            authentication.signOut();
            
            prop.nav.navigate("Login");
            prop.nav.dispatch(
              CommonActions.reset({
                 index: 0,
                 routes: [{ name: "Login" }],
             })
            );
          }}
          />
      </View>
    );
  }
}

function ProfileScreen({navigation}) {
    return (
      <View style={styles.profileContainer}>
        <Image style={{
          width: RFValue(150), 
          height: RFValue(150), 
          marginBottom: 30, 
          borderRadius: 100,
          }} source={require("./assets/pfp.jpg")}/>
        <Text style={{
          fontFamily: "Helvetica-Bold",
          fontSize: RFValue(30),
          width: "100%",
          textAlign: "center",
          marginBottom: 30,
        }}>Davis Haden</Text>
        <ProfileButton name="MyTrain"/>
        <ProfileButton name="Train Pass"/>
        <ProfileButton name="Friends"/>
        <ProfileButton name="Safety"/>
        <ProfileButton name="Past Rides"/>
        <ProfileButton name="Security"/>
        <ProfileButton name="Settings"/>
        <ProfileButton name="Log Out" nav={navigation}/>
      </View>
      
    );
}

function HomeScreen({ navigation }) {
  return (
      <Tab.Navigator>
        <Tab.Screen 
          name="Map" 
          component={MapScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Trains" 
          component={TrainScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="train" color={color} size={size} />
            ),
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

function MainApp() {
  useEffect (() => {
    const a = authentication.onAuthStateChanged(user => {
      if (user) {
        //alert('Sucess. Your account has been created. Welcome to MARTA!');
      }
      
    });
    return () => {
      a();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainApp;

const styles = StyleSheet.create({
  ScrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  headingText: {
    padding: 10,
  },
  inputView: {
    backgroundColor: "#152852",
    borderRadius: 30,
    width: "70s%",
    height: 45,
    marginBottom: 20,
    alignSelf: "center",
  },
  buttonView: {
    backgroundColor: "#fd5e53",
    borderRadius: 30,
    width: "50%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonViewSignUp: {
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 30,
    borderColor: "#fd5e53",
    width: "50%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  SubmitButton: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  h1: {
    fontFamily: "Helvetica-Bold",
    fontSize: 30,
  },
  h2: {
    fontSize: 15,
  },
  LoginVector: {
    width: "70%",
    height: "20%",
    alignSelf: "center",
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  trainBlock: {
      width: 205,
      height: 165,
      borderRadius: 15,
      opacity: 0.9,
      backgroundColor: "white",
      flexDirection: "row",
      flexWrap: 'wrap',
      alignItems: "center",
      padding: 8,
      alignContent: 'center',
      justifyContent: 'center',
      marginLeft: 10,
  },
  scrollView: {
    paddingBottom: 8,
  },
  trainIcon: {
    width: 120,
    height: 70,
    borderRadius: 15,
  },
  viewMoreButton: {
    width: 100,
    height: 30,
    borderRadius: 30,
    backgroundColor: "#fd5e53",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  singleTrainView: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
    justifyContent: 'center',
    alignItems: "center",
  },
  ClosetoTheRight: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  trainDetailIcon: {
    width: 200,
    height: 100,
  },
  profileButton: {
    backgroundColor: "#152852",
    padding: 10,
    width: RFValue(150),
    borderRadius: 30,
    margin: 3,
    marginBottom: 10,
  },
  profileContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: "white",
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: "row",
    flexWrap: 'wrap',
    
  },
  profileSubView: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
    justifyContent: 'flex-start',
    alignItems: "center",
  },
  favoriteItem: {
    flex: 1,
    height: 130,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#152852",
  },
  favStation: {
    fontSize: 20,
    color: "white",
  },
  favLine: {
    color: "white",
  },
  favContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  }
});
