import React, {useState} from 'react';
import { RadioButton, Provider as PaperProvider } from 'react-native-paper';
import {Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import useAuthStore from "../store/authSotre";
import axiosInstance from "../utils/axiosInstance";



const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const { login } = useAuthStore();
    const [checked, setChecked] = useState('first');


    const handleLogin = async () => {
        try {
          //  console.log(email,password,role);
            const res = await axiosInstance.post('/login', { email, password, role });
            if (res.data.status === "success") {
            //    console.log(res.data.data);
             //   console.log(res.data.token);
                const token = res.data.token;
                const user = res.data.data;
                const role =res.data.role;

               // console.log("user:", user);
                login(token,user,role);
                Alert.alert('Success', res.data.msg);
                navigation.navigate('Home'); // Or your protected screen
            } else {
                Alert.alert('Login Failed', res.data.msg);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error?.response?.data?.msg || 'Something went wrong');
        }
    };

    return (
        <ScrollView className="bg-[#fcd9cf] flex-1 relative">
            {/* Top Rounded Image */}
            <Image
                source={require('../../assets/img_3.png')}
                className="w-full h-[400px] rounded-b-[150px] object-cover"
            />

            {/* Logo and Title (Flexbox used for responsiveness) */}
            <View className="absolute top-10 left-1/2 -translate-x-1/2 flex-row items-center">
                <Image
                    source={require('../../assets/img_2.png')}
                    className="w-10 h-10 mr-2"
                />
                <Text className="text-2xl text-white font-bold">KindVest</Text>
            </View>
            <PaperProvider>
                <View >

                    <RadioButton.Group className="" onValueChange={value => setRole(value)} value={role}>
                        <View className="flex-row justify-center">
                        <View className="flex-row items-center ">
                            <RadioButton value="donor" />
                            <Text>Donor</Text>
                        </View>
                        <View className="flex-row items-center ">
                            <RadioButton value="volunteer" />
                            <Text>Volunteer</Text>
                        </View>
                            <View className="flex-row items-center ">
                                <RadioButton value="admin" />
                                <Text>Admin</Text>
                            </View>
                            </View>
                    </RadioButton.Group>
                </View>
                <View className="flex-row items-center border-2 border-orange-500 rounded-md m-5 px-3">
                    <TextInput
                        className="flex-1 text-xl font-bold font-mono py-4 text-orange-500"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#ed7002"
                    />
                    <MaterialCommunityIcons name="gmail" size={30} color="#ed7002" />
                </View>
                <View className="flex-row items-center border-2 border-orange-500 rounded-md mx-5 mt-2 px-3">
                    <TextInput
                        className="flex-1 text-xl font-bold font-mono py-4 text-orange-500"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        placeholderTextColor="#ed7002"
                    />
                    <Fontisto name="locked" size={30} color="#ed7002" />
                </View>
                <Text className="self-end mr-5 underline italic text-gray-600">Forget Password</Text>
            </PaperProvider>


            {/* Button Section */}
            <View className="flex-row items-center border-2 border-orange-500 rounded-md m-5 ">
                <TouchableOpacity
                    className="bg-white py-4 w-full rounded-md"
                    onPress={handleLogin}
                >
                    <Text className="text-orange-600 text-center font-bold text-2xl ">
                        Login
                    </Text>
                </TouchableOpacity>

            </View>
            <Text className=" mb-5 mx-5 self-center underline  italic text-gray-600">Don't Have Account? Signup</Text>
            <StatusBar style="light" />
        </ScrollView>
    );
};

export default LoginScreen;