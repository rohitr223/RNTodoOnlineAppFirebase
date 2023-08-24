import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Todo = ({item, onPress}) => {
  return (
    <View style={styles.todo}>
      <Text style={styles.todoText}>{item.title}</Text>
      <Icon name="trash-outline" size={30} color="#F11A7B" onPress={onPress} />
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  todo: {
    backgroundColor: '#fff',
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#000',
    borderWidth: 1,
    padding: '3%',
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: 'center',
  },
  todoText: {
    color: '#000',
    fontSize: 18,
  },
});
