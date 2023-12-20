// In App.js in a new project
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Label, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Prompt from './assets/fonts/Prompt-Light.ttf';

function LandingPage({ navigation }) {
  return (
    <View className="bg-grey-500 w-full h-full mid-h-screen justify-center">
      <Image className="mx-auto" source={require("./Logo_350.png")} />
    </View>
  );
}

function BlankPage({ navigation }) {
  return (
    <View className="bg-grey-500 w-full h-full mid-h-screen justify-center">
      
    </View>
  );
}

function LoginScreen({ navigation }) {
  return (
    <View className="w-full bg-white rounded-lg shadow dark:border mt-0 dark:bg-slate-900 dark:border-gray-700">
      <View className="flex flex-col item-center justify-center px-3 py-2 h-screen mt-10">

        <View className="p-6">
          <Text style={[{fontFamily: Prompt, fontSize: 24}]} className="font-bold text-white mx-auto">ล็อคอินเข้าสู่ระบบ</Text>
        </View>

        <View className="p-6 space-y-4">
          <Text className="text-lg text-gray-900 dark:text-white">Email</Text>
          <TextInput className="bg-gray-700 border border-gray-800 p-2 px-6 text-white rounded-full ml-1 " placeholder="Type a message"></TextInput>
        </View>
        <View className="p-6 space-y-4">
          <Text className="text-lg text-gray-900 dark:text-white">Password</Text>
          <TextInput className="bg-gray-700 border border-gray-800 p-2 px-6 text-white rounded-full ml-1 " placeholder="Type a message"></TextInput>
        </View>
        <View className="p-6 space-y-4">
          <Button title="Press me" onPress={() => Alert.alert('Simple Button pressed')} />
        </View>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();


function App() {
  const [cooldown, setCooldown] = useState('OFF');
  setTimeout(() => {
    setCooldown("ON");
  }, 3500)

  console.log(cooldown);

  if (cooldown == "ON") {
    return (
      <>
        <LoginScreen></LoginScreen>
      </>
    )
  } else {
    return (
      <LandingPage></LandingPage>
    )
  }
}
export default App;