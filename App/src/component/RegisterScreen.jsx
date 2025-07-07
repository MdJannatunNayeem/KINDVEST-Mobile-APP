import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as mime from 'react-native-mime-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from "../utils/axiosInstance";
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('donor');
    const navigation = useNavigation();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    };

    const fileUploadFun = async () => {
        if (!file) {
            Alert.alert("Warning", "Please select a profile image");
            return null;
        }

        const formData = new FormData();
        const localUri = file.uri;
        const fileName = localUri.split('/').pop();
        const fileType = mime.lookup(localUri) || "image/jpeg";

        formData.append("file", {
            uri: localUri,
            type: fileType,
            name: fileName,
        });

        try {
            const result = await axiosInstance.post('/file-upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return result.data?.file?.filename;
        } catch (error) {
            console.error("Upload error:", error.response?.data || error.message);
            Alert.alert("Error", "Image upload failed");
            return null;
        }
    };

    const submitData = async () => {
        if (!firstName || !lastName || !email || !contactNo || !address || !password) {
            Alert.alert('Warning', 'All fields are required!');
            return;
        }

        const profileImg = await fileUploadFun();

        const reqBody = {
            email,
            password,
            firstName,
            lastName,
            contactNo,
            address,
            role,
            profileImg,
        };

        try {
            const result = await axiosInstance.post('/register', reqBody);
            if (result.data?.status === true) {
                Alert.alert('Success', result.data?.msg,[
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'), // ✅ Navigate to login
                    },
                ]);
            } else {
                Alert.alert('Error', "Registration failed");
            }
        } catch (e) {
            Alert.alert('Error', 'Registration failed');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-100"
        >
            <ScrollView className="p-4">
                <SafeAreaView className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg self-center mt-9">
                    <Text className="text-4xl font-bold text-center text-orange-400 mb-2">
                        Create Your Account
                    </Text>
                    <Text className="text-center text-gray-600 mb-6">
                        Already have an account?{' '}
                        <Text className="text-blue-600 underline">Sign In</Text>
                    </Text>

                    <View className="flex-row gap-4 mb-4">
                        <TextInput
                            className="flex-1 border border-orange-400 rounded-md px-3 py-4 text-orange-600"
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            className="flex-1 border border-orange-400 rounded-md px-3 py-4 text-orange-600"
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    <View className="flex-row gap-4 mb-4">
                        <TextInput
                            className="flex-1 border border-orange-400 rounded-md px-3 py-4 text-orange-600"
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            className="flex-1 border border-orange-400 rounded-md px-3 py-4 text-orange-600"
                            placeholder="Contact No"
                            keyboardType="phone-pad"
                            value={contactNo}
                            onChangeText={setContactNo}
                        />
                    </View>

                    <TextInput
                        className="mb-4 border border-orange-400 rounded-md px-3 py-4 text-orange-600"
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                    />

                    <View className="mb-4">
                        <Text className="text-2xl font-medium text-orange-400 mb-2">Registering As</Text>
                        <View className="flex-row gap-6">
                            <TouchableOpacity
                                className="flex-row items-center gap-2"
                                onPress={() => setRole('donor')}
                            >
                                <View
                                    className={`w-4 h-4 rounded-full border-2 ${
                                        role === 'donor' ? 'bg-orange-500' : 'border-gray-400'
                                    }`}
                                />
                                <Text className="text-lg text-orange-400">Donor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center gap-2"
                                onPress={() => setRole('volunteer')}
                            >
                                <View
                                    className={`w-4 h-4 rounded-full border-2 ${
                                        role === 'volunteer' ? 'bg-orange-500' : 'border-gray-400'
                                    }`}
                                />
                                <Text className="text-lg text-orange-400">Volunteer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TextInput
                        className="my-4 border border-orange-400 rounded-md px-3 py-4 text-orange-600"
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity onPress={pickImage} className="my-4">
                        <View className="w-full bg-orange-400 py-4 rounded-md items-center">
                            <Text className="text-white font-semibold">Select Profile Picture</Text>
                        </View>
                    </TouchableOpacity>

                    {file && (
                        <Image
                            source={{ uri: file.uri }}
                            className="w-24 h-24 rounded-full self-center mb-4"
                        />
                    )}

                    <TouchableOpacity onPress={submitData}>
                        <View className="w-full bg-orange-500 py-4 rounded-md items-center mt-2">
                            <Text className="text-white font-semibold">Create Account</Text>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
