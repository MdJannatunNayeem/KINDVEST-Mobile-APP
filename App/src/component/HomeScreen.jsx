import React, {useEffect} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text, TouchableOpacity} from "react-native";
import {StatusBar} from "expo-status-bar";
import useAuthStore from "../store/authSotre";



const HomeScreen = ({navigation}) => {
    const { token, loadToken,logout } = useAuthStore();


    useEffect(() => {
        loadToken();
    }, []);

    return (
        <SafeAreaView className="bg-blue-200 h-full">
        <Text className="bg-blue-200 p-6 m-2 text-2xl">Home</Text>
            <TouchableOpacity
                className="bg-blue-600 p-4 rounded-md mx-32"
                onPress={() => navigation.navigate('Login')}
            >
                <Text className="text-white text-center font-bold text-lg">
                    Go to Login
                </Text>
            </TouchableOpacity>

            {token && (

                <TouchableOpacity
                    className="bg-red-600 p-4 rounded-md mx-32 mt-4"
                    onPress={() => {
                        // Add logout logic here if needed
                        logout();
                    }}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        Logout
                    </Text>
                </TouchableOpacity>
            )}


    <StatusBar style="auto" />
</SafeAreaView>
    );
};

export default HomeScreen;