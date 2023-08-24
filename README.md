This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


## If Home.js is not working after editing it...
## Please directly paste the below code into your Home.js file.

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

      setTodos(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  // trying to fetch user information fron async storage.
  const getUserInfo = async () => {
    try {
      const uid = await AsyncStorage.getItem('ID');
      const name = await AsyncStorage.getItem('NAME');
      const email = await AsyncStorage.getItem('EMAIL');
      const photo = await AsyncStorage.getItem('PHOTO');
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

  // Creating a firestore database for sotring the TODO's
  const ref = firestore().collection('todos');

  // Adding new TODO's
  const addTodo = async () => {
    await ref.add({
      id: userId,
      title: todo,
      complete: false,
    });
    setTodo('');
  };

  // delete the TODO with a specific id
  const deleteTodo = async id => {
    await ref.doc(id).delete();
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
            // To reduce the overall spacing issue,  we only need first 10 letter of user's name.
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
