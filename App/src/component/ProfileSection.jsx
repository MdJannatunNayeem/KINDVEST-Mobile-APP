import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as mime from 'react-native-mime-types';
import axiosInstance from '../utils/axiosInstance';
import { BaseURL } from '../utils/Config';
import useAuthStore from "../store/authSotre";

const ProfileSection = () => {
    const [file, setFile] = useState(null);
    const [change, setChange] = useState({});
    const [formdata, setFormdata] = useState({
        email: '',
        firstName: '',
        lastName: '',
        profileImg: '',
        contactNo: '',
        address: '',
    });


    const { loadUser } = useAuthStore();



    // 🔁 Fetch profile details
    useEffect(() => {
        (async () => {
            try {
                const Details = await axiosInstance.get('user-details');
                console.log(Details.data);

                if (Details?.data) {
                    loadUser(Details.data.data);
                    setFormdata({
                        email: Details.data.data.email,
                        firstName: Details.data.data.firstName,
                        lastName: Details.data.data.lastName,
                        profileImg: Details.data.data.profileImg,
                        contactNo: Details.data.data.contactNo,
                        address: Details.data.data.address,
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        })();
    }, [change]);

    // 📤 Pick image from gallery
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

    // 🖼 Upload image file
    const fileUploadFun = async () => {
        if (!file) {
            Alert.alert('Warning', 'Please select a profile image');
            return null;
        }

        const formData = new FormData();
        const localUri = file.uri;
        const fileName = localUri.split('/').pop();
        const fileType = mime.lookup(localUri) || 'image/jpeg';

        formData.append('file', {
            uri: localUri,
            type: fileType,
            name: fileName,
        });

        try {
            const result = await axiosInstance.post('/file-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return result.data?.file?.filename;
        } catch (error) {
            console.error('Upload error:', error.response?.data || error.message);
            Alert.alert('Error', 'Image upload failed');
            return null;
        }
    };

    // ✅ Handle input change
    const handleChange = (name, value) => {
        setFormdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Submit profile update
    const submitData = async () => {
        try {
            let img;
            if (file) {
                img = await fileUploadFun();
            }

            const requestBody = {
                ...formdata,
                profileImg: img || formdata.profileImg,
            };

            const response = await axiosInstance.post('/update-profile', requestBody);
            if (response.status) {
                Alert.alert('Success', 'Profile updated successfully!');
                setFile(null);
                setChange(formdata);

            } else {
                Alert.alert('Error', 'Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-900 px-5 py-10">
            <View className="items-center mb-6">
                <Text className="text-2xl text-orange-400 font-bold">Profile Details</Text>
            </View>

            <View className="items-center mb-4">
                <Image
                    source={{
                        uri: file?.uri || `${BaseURL}/upload-file/${formdata?.profileImg}`,
                    }}
                    className="w-24 h-24 rounded-md border-2 border-orange-400"
                />
                <TouchableOpacity onPress={pickImage} className="mt-2 bg-orange-500 px-3 py-1 rounded-md">
                    <Text className="text-white text-xs font-semibold">Change Photo</Text>
                </TouchableOpacity>
            </View>

            <View className="space-y-4">
                <TextInput
                    className="border border-orange-400 rounded-md px-3 py-2 text-white"
                    placeholder="First Name"
                    placeholderTextColor="#ccc"
                    value={formdata.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                />
                <TextInput
                    className="border border-orange-400 rounded-md px-3 py-2 text-white"
                    placeholder="Last Name"
                    placeholderTextColor="#ccc"
                    value={formdata.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                />
                <TextInput
                    className="border border-orange-400 rounded-md px-3 py-2 text-white"
                    placeholder="Email"
                    editable={false}
                    placeholderTextColor="#ccc"
                    value={formdata.email}
                />
                <TextInput
                    className="border border-orange-400 rounded-md px-3 py-2 text-white"
                    placeholder="Contact Number"
                    placeholderTextColor="#ccc"
                    value={formdata.contactNo}
                    onChangeText={(text) => handleChange('contactNo', text)}
                />
                <TextInput
                    className="border border-orange-400 rounded-md px-3 py-2 text-white"
                    placeholder="Address"
                    placeholderTextColor="#ccc"
                    value={formdata.address}
                    onChangeText={(text) => handleChange('address', text)}
                />

                <TouchableOpacity onPress={submitData} className="mt-4 bg-orange-500 p-3 rounded-md">
                    <Text className="text-white text-center font-bold">Update</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileSection;
