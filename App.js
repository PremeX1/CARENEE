import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Button, FlatList, Linking, ScrollView, View, Text, Pressable, TextInput, Label, Image, BackHandler, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import axios from 'axios';
import Modal from "react-native-modal";
import { WebView } from 'react-native-webview';


//EE 55 6 7 --- 8 -- IP-4XXX.2XX const url == "44E" --
const url = "http://192.168.0.4:3000/"
const url_web = "http://192.168.0.4:5000/"


function LandingPage({ navigation }) {
  setTimeout(() => {
    AsyncStorage.getItem('Student_ID').then((result) => {
      console.log("TEST", result)
      if (!result) {
        navigation.navigate('Login')
      } else {
        navigation.navigate('Dashboard')
      }
    })
  }, 3000)

  return (
    <View className="bg-slate-900 w-full h-full mid-h-screen justify-center">
      <Image className="mx-auto" source={require("./img/Logo_350.png")} />
    </View>
  );
}


function ChatScreen({ navigation }) {
  const [id, setID_] = useState()
  useEffect(() => {
    AsyncStorage.getItem('Student_ID').then((result) => {
      setID_(result)
    })
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <View className="flex-row bg-slate-900 hover:bg-red-700 w-full p-3 text-white font-bold">
        <Pressable className="bg-rose-400 text-black w-12 font-bold py-1 rounded-sm" onPress={() => navigation.navigate('Dashboard')}>
          <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-black mx-auto">ออก</Text>
        </Pressable>
        <View className="justify-center text-center items-center center" style={[{ marginLeft: 110 }]}>
          <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-white">แชททั้งหมด</Text>
        </View>
      </View>
      <WebView source={{ uri: `${url_web}?id=${id}` }} />
    </View>
  );

}

function SendRequestTeacher({ navigation }) {
  const [request_D, setData] = useState({})
  const [name, setName] = useState()
  const [typeRe, setType] = useState()
  const [msgRe, setMsg] = useState()
  async function handleSubmit() {
    if(name && typeRe && msgRe) {
      AsyncStorage.getItem('Student_ID').then((result) => {
        axios({
          method: 'post',
          url: `${url}request_t`,
          data: {
            request_type: typeRe,
            request_by: result,
            request_msg: `ชื่อ ${name} - ${msgRe}`,
            request_status: "รอการตรวจสอบ",
            request_time: new Date()
          }
        }).then(() => {
          Alert.alert('ข้อความจากระบบ', 'ส่งขอร้องขอสำเร็จ รอการตรวจสอบ');
          navigation.navigate('Dashboard')
        })
      })
    } else {
      Alert.alert('ข้อความจากระบบ', 'โปรดกรอกข้อมูลของคุณ');
    }
    
  }


  const getRequestByID = (id) => {
    axios.get(url + `getRequestByID?id=${id}`).then((res) => {
      setData(res.data.result)
      console.log(res.data.result)
    }).catch((err) => {
      // console.log(err);
    })
  };

  const [notification_, setNotificationAlert] = useState(false);
  const showNotification = () => {
    setNotificationAlert(!notification_);
      AsyncStorage.getItem('Student_ID').then((result) => {
        getRequestByID(result)
      })
  };
  return (
  <View className="w-full h-full border bg-slate-900">
      <Modal isVisible={notification_}>
        <View style={{ flex: 1 }} className="p-0">
          <FlatList
            data={request_D}
            renderItem={({ item }) =>
              <View className="mt-3 bg-black p-3 rounded-2xl">
                <View className="flex-1">
                  <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="px-2 text-white">ส่งขอร้องเมื่อ : <Text className="text-yellow-400">{item.request_time}</Text></Text>
                  <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="px-2 text-white">สถานะ: <Text className="text-yellow-400">{item.request_status}</Text></Text>
                </View>
                <View className="flex-1 mt-5">
                  <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} className="px-2 text-white">ข้อความ</Text>
                  <Text style={[{ fontFamily: 'Prompt-Light', fontSize: 15 }]} className="px-2 text-white"><Text className="text-white">{item.request_msg}</Text></Text>
                </View>


              </View>



            }
          />
          <Pressable className="bg-red-400 hover:bg-red-700 w-full mt-2 text-white font-bold py-1 rounded-2xl" onPress={showNotification}>
            <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-black mx-auto">ปิดหน้านี้</Text>
          </Pressable>
        </View>
      </Modal>
    <View className="flex flex-col item-center justify-center px-3 mt-5 py-2">

      <View className="p-4">
        <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 27 }]} className="text-white mx-auto">ส่งคำร้องขอ ต่อผู้ดูแลระบบ</Text>
        <Text style={[{ fontFamily: 'Prompt-Light', fontSize: 15 }]} className="text-white mx-auto">สามารถแจ้งคำที่คุณต้องการจะร้องขอต่อผู้ดูแลระบบ</Text>
      </View>

      <View className="p-6 space-y-4">
        <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="text-lg text-white">ชื่อผู้ร้องขอ</Text>
        <TextInput  onChangeText={e => setName(e)} style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="bg-gray-700 border border-gray-800 p-2 px-6 text-white rounded-full ml-1 " placeholder="กรอกชื่อของคุณ"></TextInput>
      </View>
      <View className="p-6 space-y-4">
        <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="text-lg text-white">ต้องการร้องขอเรื่องอะไร?</Text>
        <TextInput  onChangeText={e => setType(e)} className="bg-gray-700 border border-gray-800 p-2 px-6 text-white rounded-full ml-1 " placeholder="ตัวอย่างเช่น แจ้งลาป่วย ขอใบเอกสาร ปพ.1"></TextInput>
      </View>
      <View className="p-6 space-y-4">
        <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="text-lg text-white">ข้อความที่จะร้องขอ</Text>
        <TextInput onChangeText={e => setMsg(e)} className="bg-gray-700 border border-gray-800 p-2 px-6 text-white rounded-full ml-1 " placeholder="ตัวอย่างเช่น แจ้งลาป่วย ขอใบเอกสาร ปพ.1"></TextInput>
      </View>
      <Text style={[{ fontFamily: 'Prompt-Italic', fontSize: 16 }]} className="text-lg text-red-600 ml-7"></Text>
      <View className="flex space-y-5 p-6 mt-6">
        <Pressable className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl">
          <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} onPress={() => handleSubmit() }className="text-white mx-auto">ส่งขำร้อง</Text>
        </Pressable>
        <Pressable className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl">
          <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} onPress={() => showNotification() }className="text-white mx-auto">สถานะคำร้องทั้งหมด</Text>
        </Pressable>
        <Pressable className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl">
          <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} onPress={() => navigation.navigate('Dashboard')}className="text-white mx-auto">ย้อนกลับ</Text>
        </Pressable>
      </View>
    </View>
  </View >
  );

}

function Dashboard({ navigation }) {

  const [userData, setData] = useState(false)
  const [Noti, setNotification] = useState({})
  const [StudentGrade, setGradeInfo] = useState({});
  const [studentID, setID] = useState()

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
  );

  function logout() {
    AsyncStorage.clear();
    AsyncStorage.getItem('Student_ID').then((result) => {
      console.log("TEST", result)
      if (!result) {
        navigation.navigate('Login')
        Alert.alert('ข้อความจากระบบ', 'กำลังออกจากระบบ');
        setTimeout(() => {
          BackHandler.exitApp()
        }, 2000)
      } else {
        navigation.navigate('Dashboard')
      }
    })
  }

  const getUserProfile = (id) => {
    axios.get(url + `profile?id=${id}`).then((res) => {
      setData(res.data)
    }).catch((err) => {
      // console.log(err);
    })
  };

  const getNotificate = (id) => {
    axios.get(url + `getNotificate?id=${id}`).then((res) => {
      setNotification(res.data.result)
    }).catch((err) => {
      // console.log(err);
    })
  };

  const getGradeStudent = (id) => {
    axios.get(url + `getGradeStudent?id=${String(id)}`).then((res) => {
      setGradeInfo(res.data.result)
      // console.log(res);
    }).catch((err) => {
      // console.log(err);
    })
  };



  const [notification_, setNotificationAlert] = useState(false);
  const showNotification = () => {
    setNotificationAlert(!notification_);
  };


  const [gradeModal, setGradeModal] = useState(false);
  const gradeModal_ = () => {
    setGradeModal(!gradeModal);
  };

  useEffect(() => {
    AsyncStorage.getItem('Student_ID').then((result) => {
      console.log(result);
      getUserProfile(result);
      getNotificate(result);
      getGradeStudent(result);
    })
  }, [])

  // var Image_source = `<Image className="w-24 h-24 mb-3 rounded-full shadow-lg" source={{ uri: https://cdn.discordapp.com/attachments/982236915153641472/982236994610532352/received_1003737893663633.jpeg }} />`
  return (
    <View className="w-full p-4 bg-slate-900 border shadow h-full">

      {/* การแจ้งเตือน */}

      <Modal isVisible={notification_}>
        <View style={{ flex: 1 }} className="p-0">
          <FlatList
            data={Noti}
            renderItem={({ item }) =>
              <View className="mt-3 bg-black p-3 rounded-2xl">
                <View className="flex-1">
                  <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="px-2 text-white">แจ้งเตือนเมื่อ : <Text className="text-yellow-400">{item.time}</Text></Text>
                  <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="px-2 text-white">แจ้งโดย: <Text className="text-yellow-400">{item.own}</Text></Text>
                </View>
                <View className="flex-1 mt-5">
                  <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} className="px-2 text-white">ข้อความ</Text>
                  <Text style={[{ fontFamily: 'Prompt-Light', fontSize: 15 }]} className="px-2 text-white"><Text className="text-white">{item.msg}</Text></Text>
                </View>


              </View>



            }
          />
          <Pressable className="bg-red-400 hover:bg-red-700 w-full mt-2 text-white font-bold py-1 rounded-2xl" onPress={showNotification}>
            <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-black mx-auto">ปิดการแจ้งเตือน</Text>
          </Pressable>
        </View>
      </Modal>

      {/* เกรด */}

      <Modal isVisible={gradeModal}>
        <View style={{ flex: 1 }} className="p-0">
          <FlatList
            data={StudentGrade}
            renderItem={({ item }) =>
              <View className="mt-3 bg-black p-3 rounded-2xl">
                <View className="flex-1">
                  <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 20 }]} className="px-2 text-white">ชั้นมัธยมศึกษา: <Text className="text-emerald-400">{item.class}</Text></Text>
                  <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 17 }]} className="px-2 text-white">เกรดเฉลี่ย GPA: <Text className="text-emerald-400">{item.grade}</Text></Text>
                </View>
                <View className="flex-1 mt-5">
                  <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} className="px-2 text-white">ลิงค์เกรด</Text>
                  <Pressable className="bg-blue-400 hover:bg-blue-700 w-full mt-2 text-white font-bold py-1 rounded-2xl" onPress={() => Linking.openURL(`${item.grade_file}`)}>
                    <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-black mx-auto">เปิดลิงค์</Text>
                  </Pressable>
                </View>


              </View>



            }
          />
          <Pressable className="bg-red-400 hover:bg-red-700 w-full mt-2 text-white font-bold py-1 rounded-2xl" onPress={gradeModal_}>
            <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-black mx-auto">ซ่อน</Text>
          </Pressable>
        </View>
      </Modal>

      <View className="flex first-line:px-4 pt-4 border border-gray-200 rounded-3xl p-3 bg-gray-200">
        <View className="flex flex-row -mt-2">
          <View className="p-5 mt-2 py-2">
            <Image className="w-24 h-24 mb-3 rounded-full shadow-lg" source={{ uri: `${!userData ? "https://demofree.sirv.com/nope-not-here.jpg" : userData.result[0].profile_pic}` }} />
          </View>
          <View className="p-5">
            <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 15 }]} className="mb-2 font-medium text-black">{!userData ? "Loading" : userData.result[0].fulll_name}</Text>
            <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 12 }]} className="text-sm text-black">ชั้นมัธยมศึกษาปีที่ {!userData ? "Loading" : userData.result[0].room}</Text>
            <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 12 }]} className="text-sm text-black">รหัสนักเรียน: {!userData ? "Loading" : userData.result[0].stu_id}</Text>
            <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 12 }]} className="text-sm text-black">เข้าโรงเรียนล่าสุด: {!userData ? "Loading" : userData.result[0].check_in}</Text>
          </View>
        </View>
        <View className="flex flex-row py-2 bg-transparent">


          <View className="mt-2 w-48 mx-auto">
            <Pressable className="bg-cyan-400 hover:bg-blue-700 w-full text-white font-bold py-1 rounded-2xl" onPress={showNotification}>
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-black mx-auto">การแจ้งเตือน</Text>
            </Pressable>
          </View>

          <View className="mt-2 w-32 mx-auto">
            <Pressable className="bg-rose-400 hover:bg-blue-700 w-full text-white font-bold py-1 rounded-2xl" onPress={() => logout()}>
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="text-black mx-auto">ออกจากระบบ</Text>
            </Pressable>
          </View>

        </View>
      </View>
      <View className="flex mt-5">
        <ScrollView>

          <View className="border border-gray-200 bg-gray-200 rounded-3xl">
            <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 27 }]} className=" text-black text-center p-1 rounded-xl">ผลการเรียน <Text className="text-orange-500">(BETA)</Text></Text>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}></View>
            <Icon.Button name="graduation-cap" color="#7e22ce" backgroundColor="#e5e7eb" className="mt-3 mx-auto item-center justify-center" onPress={gradeModal_} size={100}>
            </Icon.Button>
            <View className="py-2 px-6">
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 20 }]} className="text-black">รายละเอียด: </Text>
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="py-1 mb-3 font-normal text-gray-600">สำหรับดูเกรดของคุณ และรายละเอียดคะแนนของนักเรียน การได้คะแนนของแต่ละวิชา </Text>
            </View>
          </View>

          <View className="border border-gray-200 bg-gray-200 rounded-3xl mt-5">
            <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 27 }]} className=" text-black text-center p-1 rounded-xl">แชทรวม <Text className="text-orange-500">(BETA)</Text></Text>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}></View>
            <Icon.Button name="group" color="#7e22ce" backgroundColor="#e5e7eb" className="mt-3 mx-auto item-center justify-center" onPress={() => navigation.navigate('ChatScreen')} size={100}>
            </Icon.Button>
            <View className="py-2 px-6">
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 20 }]} className="text-black">รายละเอียด:</Text>
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="py-1 mb-3 font-normal text-gray-600">สำหรับสื่อสารกันภายในสถานศึกษา โดยเป็นข้อความที่ทั้งผู้ใช้ที่ใช้งานแอปจะเห็นด้วยกันทั้งหมด </Text>
            </View>
          </View>

          <View className="border border-gray-200 bg-gray-200 rounded-3xl mt-5">
            <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 27 }]} className=" text-black text-center p-1 rounded-xl">ส่งคำร้องขอ <Text className="text-orange-500">(BETA)</Text></Text>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}></View>
            <Icon.Button name="paper-plane" color="#7e22ce" backgroundColor="#e5e7eb" className="mt-3 mx-auto item-center justify-center" onPress={() => navigation.navigate('SendRequestTeacher')} size={100}>
            </Icon.Button>
            <View className="py-2 px-6">
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 20 }]} className="text-black">รายละเอียด:</Text>
              <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 16 }]} className="py-1 mb-3 font-normal text-gray-600">สำหรับแจ้งเหตุ แจ้งลาป่วย สำหรับนักเรียน หรือขอเอกสารต่างๆกับ หน่วยการในสถานศึกษา</Text>
            </View>
          </View>

          <View className="p-6 border mt-64 rounded-3xl shadow">
          </View>
        </ScrollView>


      </View>
    </View>

  );
}

function LoginScreen({ navigation }) {


  // setTimeout(() => {
  //   navigation.navigate('Dashboard')
  // }, 100)

  const [stduent_id, setStudentID] = useState()
  const [Password, setPassword] = useState()
  const [Warning, setWarning] = useState()

  // fetch(url+'/login').then((resp) => {
  //   console.log(resp);
  // });


  useEffect(() => {
    const backAction = () => {
      Alert.alert('คุณต้องการออกจากแอพหรือไม่', 'คุณต้องการออกจากแอพหรือไม่', [
        {
          text: 'ยกเลิก',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'ออก', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);



  const [notification_, setNotification] = useState(false);

  const showNotification = () => {
    setNotification(!notification_);
  };

  async function handleSubmit() {
    axios({
      method: 'post',
      url: `${url}login`,
      data: {
        id: stduent_id,
        password: Password
      }
    }).then(response => {
      Alert.alert('ข้อความจากระบบ', 'เข้าสู่ระบบสำเร็จ');
      if (response.data.code == "SUCCESS") {
        setWarning("")
        AsyncStorage.setItem('Student_ID', response.data.id)
        AsyncStorage.getItem('Student_ID').then((result) => {
          console.log("TEST", result)
          if (!result) {
            navigation.navigate('Login')
          } else {
            navigation.navigate('Dashboard')
          }
        })
      }
    }).catch((err) => {
      setWarning("* ไม่สามารถเข้าสู่ระบบได้ กรุณารองใหม่อีกครั้ง")
      console.log("ERR" + err);
    })
  }

  return (
    <View className="w-full h-full border bg-slate-900">
      <Modal isVisible={notification_}>
        <View className="flex justify-center item-center text-center">
          <View className="p-6 space-y-4">
          </View>
          <Pressable className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onPress={showNotification}>
            <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} className="text-white mx-auto">ตกลง</Text>
          </Pressable>
        </View>
      </Modal>
      <View className="flex flex-col item-center justify-center px-3 py-2 mt-28">

        <View className="p-4">
          <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 27 }]} className="text-white mx-auto">ล็อคอินเข้าสู่ระบบ</Text>
          <Text style={[{ fontFamily: 'Prompt-Light', fontSize: 15 }]} className="text-white mx-auto">ใช้ไอดีและรหัสผ่านของผู้ดูแลสถาบันให้สำหรับการเข้าสู่ระบบ</Text>
        </View>

        <View className="p-6 space-y-4">
          <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="text-lg text-white">Student ID / ไอดีนักเรียน</Text>
          <TextInput keyboardType='numeric' onChangeText={e => setStudentID(e)} style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="bg-gray-700 border border-gray-800 p-2 px-6 text-white rounded-full ml-1 " placeholder="กรอกไอดีที่สถาบันของคุณให้มาที่นี้"></TextInput>
        </View>
        <View className="p-6 space-y-4">
          <Text style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="text-lg text-white">Password / รหัสผ่านเข้าสู่ระบบ</Text>
          <TextInput onChangeText={e => setPassword(e)} style={[{ fontFamily: 'Prompt-Medium', fontSize: 17 }]} className="bg-gray-700 border border-gray-800 p-2 px-6 text-white rounded-full ml-1 " secureTextEntry={true} placeholder="กรอกรหัสผ่านของคุณที่นี้"></TextInput>
        </View>
        <Text style={[{ fontFamily: 'Prompt-Italic', fontSize: 16 }]} className="text-lg text-red-600 ml-7">{Warning}</Text>
        <View className="space-y-5 p-6 mt-6">
          <Pressable className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl" onPress={() => handleSubmit()}>
            <Text style={[{ fontFamily: 'Prompt-SemiBold', fontSize: 16 }]} className="text-white mx-auto">ตกลง</Text>
          </Pressable>
        </View>

      </View>


    </View>
  );
}

const Stack = createNativeStackNavigator();


function App(navigation) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" options={{ gestureEnabled: false }} component={LandingPage} headerMode='none'></Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} headerMode='none'></Stack.Screen>
        <Stack.Screen name="Dashboard" component={Dashboard} headerMode='none'></Stack.Screen>
        <Stack.Screen name="ChatScreen" component={ChatScreen} headerMode='none'></Stack.Screen>
        <Stack.Screen name="SendRequestTeacher" component={SendRequestTeacher} headerMode='none'></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default App;


