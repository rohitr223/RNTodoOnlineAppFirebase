import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import Todo from '../components/Todo';
import {TextInput, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

const Home = ({navigation}) => {
  // firebase user auth
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [press, setPress] = useState(null);
  //console.log(userId)

  // todo's
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  /*
    Important Note -:
    Here we have not added an empty array [] at the end of useEffect because we
    want to run it multiple times and not only when this screen loads.
    So we dont add any [] at the end.
    If we want to run useEffect only one time when the screen loads then we add [].
  */
  useEffect(() => {
    getUserInfo();
  }, []);

  // Function for loading the todo in our app.
  useEffect(() => {
    // using querySnapshot parameter for accessing fire-store doc's.
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, complete} = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
      // storing the list array in useState variable.
      setTodos(list);

      if (loading) {
        setLoading(false);
      }
    });
  });

  // trying to fetch user information fron async storage.
  const getUserInfo = async () => {
    try {
      const uid = await AsyncStorage.getItem('ID');
      const name = await AsyncStorage.getItem('NAME');
      const email = await AsyncStorage.getItem('EMAIL');
      const photo = await AsyncStorage.getItem('PHOTO');
      // storing all the values in useState variables.
      setUserId(uid);
      setUserName(name);
      setUserEmail(email);
      setUserPhoto(photo);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // signout function
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      // delete user token from AsyncStorage when logged out.
      await AsyncStorage.setItem('userToken', '');
      // delete other user credentials also from AsyncStorage when logged out.
      await AsyncStorage.setItem('ID', '');
      await AsyncStorage.setItem('NAME', '');
      await AsyncStorage.setItem('EMAIL', '');
      await AsyncStorage.setItem('PHOTO', '');
      // Signout successful alert.
      Alert.alert('Sign Out Successful');
      // when sign out navigate back to Signin screen.
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Sign Out Error', error);
    }
  };

  /*
    Creating a firestore database for storing the TODO's
    Here we are giving a unique "userId" to doc(documents) because only the logged in
    user can view their todo. If we dont use an uniqueId then any user can view everything
    without privacy.
    Other users cannot see other persons todos.
  */
  const ref = firestore()
    .collection('todos')
    .doc(userId)
    .collection('userTodoItem');

  // Adding new TODO's
  const addTodo = async () => {
    await ref.add({
      id: userId,
      title: todo,
      complete: false,
      createdAt: new Date(),
    });
    setTodo('');
  };

  // delete the TODO with a specific id
  const deleteTodo = async id => {
    await ref.doc(id).delete();
    //console.log(ref.doc(id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {userPhoto === null ? (
            <Icon name="person-circle-outline" size={50} color="#F0DE36" />
          ) : (
            <Image source={{uri: userPhoto}} style={styles.headerPhoto} />
          )}
          {userName != null && (
            // To reduce the overall spacing issue,  we only need first 10 letter's of user's name.
            <Text style={styles.headerTitle}>{userName.slice(0, 15)}</Text>
          )}
        </View>
        <Icon
          name="menu-outline"
          size={30}
          color="#EFEFEF"
          onPress={setPress}
        />
        {press ? (
          <View style={styles.drawer}>
            <Icon
              name="close-circle-outline"
              size={40}
              color="#16FF00"
              onPress={() => !setPress(null)}
            />
            <View style={styles.drawerInfo}>
              {userPhoto === null ? (
                <Icon
                  name="person-circle-outline"
                  size={100}
                  color="#F0DE36"
                  onPress={() => !setPress(null)}
                />
              ) : (
                <Image source={{uri: userPhoto}} style={styles.drawerUserImg} />
              )}
              <View style={styles.seperator} />
              <View style={styles.seperator} />
              {userName != null && <Text style={styles.name}>{userName}</Text>}
              <View style={styles.seperator} />
              {userName != null && (
                <Text style={styles.email}>{userEmail}</Text>
              )}
              <View style={styles.seperator} />
              <View style={styles.seperator} />
              <Button
                buttonColor="#525FE1"
                textColor="#FFF"
                mode="contained"
                onPress={signOut}>
                Sign Out
              </Button>
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.todosInputContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Enter Your Task (Max 35 words)"
            maxLength={35}
            value={todo}
            activeOutlineColor="#525FE1"
            onChangeText={setTodo}
            style={styles.textInput}
          />
          <Button
            mode="contained"
            style={styles.button}
            // initially disabled if text is not changed/entered in text input.
            disabled={!todo}
            onPress={() => addTodo()}>
            <Text style={styles.buttonText}>+</Text>
          </Button>
        </View>
      </View>
      <View style={styles.todosView}>
        {/* <FlatList data={DATA} renderItem={({item}) => <Todo item={item} />} /> */}
        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Todo item={item} onPress={() => deleteTodo(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0D1282',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerPhoto: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  userImg: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  drawer: {
    padding: 20,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#0D1282',
    height: 600,
    width: '90%',
    elevation: 10,
    zIndex: 1,
  },
  drawerInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerUserImg: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  seperator: {
    height: 10,
  },
  todosInputContainer: {
    zIndex: -1,
    marginBottom: '3%',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 10,
    color: '#F0DE36',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0DE36',
  },
  email: {
    color: '#F0DE36',
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  textInput: {
    flex: 1,
    width: '90%',
  },
  button: {
    marginLeft: 5,
    backgroundColor: '#525FE1',
  },
  buttonText: {
    padding: 3,
    fontSize: 18,
    fontWeight: 'bold',
  },
  todosView: {
    flex: 1,
    zIndex: -1,
  },
});
