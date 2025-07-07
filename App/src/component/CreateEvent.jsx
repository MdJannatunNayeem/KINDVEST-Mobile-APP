import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from "../utils/axiosInstance";
import * as mime from "react-native-mime-types";
import axiosImageInstance from "../utils/axiosImageInstance";

const CreateEvent = () => {
    const navigation = useNavigation();
    const [donations, setDonations] = useState([]);
    const [file, setFile] = useState(null);
    const [data, setData] = useState({
        areaName: '',
        description: '',
        status: '',
        donationId: '',
        bannerImg: ''
    });

    const fetchDonations = async () => {
        try {
            const DonationList = await axiosInstance.get('find-all-donations');
            setDonations(DonationList?.data?.data || []);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch donation list.');
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

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
            const result = await axiosImageInstance.post('/api/file-upload', formData );
            return result.data?.file?.filename;
        } catch (error) {

            Alert.alert("Error", "Image upload failed");
            return null;
        }
    };

    const submitData = async () => {
        if (!data.donationId || !data.description || !data.areaName || !data.status) {
            Alert.alert('Validation', 'Please fill out all fields.');
            return;
        }

        try {
            const img = await fileUploadFun();
            const fullData = { ...data, bannerImg: img };
            const result = await axiosInstance.post('create-event', fullData);

            if (result?.data?.status === true) {
                Alert.alert('Success', 'Event created successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
                ]);
            } else {
                Alert.alert('Error', 'Failed to create event.');
            }
        } catch (error) {
            console.error('Create Event Error:', error?.response?.data || error.message);
            Alert.alert('Error', 'Something went wrong while creating the event.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View className="bg-white p-5 rounded-xl shadow-lg">
                    <Text className="text-center text-2xl font-bold text-orange-400 mb-6">
                        Create a Donation Event
                    </Text>

                    {/* Donation Picker */}
                    <Text className="text-base font-medium text-orange-400 mb-1">Program</Text>
                    <View className="border border-orange-400 rounded-md mb-4">
                        <Picker
                            selectedValue={data.donationId}
                            onValueChange={(itemValue) => setData({ ...data, donationId: itemValue })}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select a Program" value="" />
                            {donations.map((d) => (
                                <Picker.Item label={d.title} value={d._id} key={d._id} />
                            ))}
                        </Picker>
                    </View>

                    {/* Area Name */}
                    <Text className="text-base font-medium text-orange-400 mb-1">Area Name</Text>
                    <TextInput
                        value={data.areaName}
                        onChangeText={(text) => setData({ ...data, areaName: text })}
                        placeholder="Enter area name"
                        className="border border-orange-400 rounded-md px-3 py-2 mb-4 text-sm text-gray-800"
                    />

                    {/* Description */}
                    <Text className="text-base font-medium text-orange-400 mb-1">Description</Text>
                    <TextInput
                        value={data.description}
                        onChangeText={(text) => setData({ ...data, description: text })}
                        placeholder="Enter description"
                        multiline
                        numberOfLines={3}
                        className="border border-orange-400 rounded-md px-3 py-2 mb-4 text-sm text-gray-800"
                    />

                    {/* Status Picker */}
                    <Text className="text-base font-medium text-orange-400 mb-1">Status</Text>
                    <View className="border border-orange-400 rounded-md mb-4">
                        <Picker
                            selectedValue={data.status}
                            onValueChange={(itemValue) => setData({ ...data, status: itemValue })}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select Status" value="" />
                            <Picker.Item label="Pending" value="pending" />
                            <Picker.Item label="Running" value="running" />
                            <Picker.Item label="Finished" value="finished" />
                        </Picker>
                    </View>

                    {/* Banner Image Picker */}
                    <Text className="text-base font-medium text-orange-400 mb-1">Banner Image</Text>
                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-orange-400 rounded-md py-2 px-4 mb-4"
                    >
                        <Text className="text-white text-center font-semibold">Select Banner Image</Text>
                    </TouchableOpacity>

                    {file && (
                        <Image
                            source={{ uri: file.uri }}
                            style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 10 }}
                        />
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={submitData}
                        className="bg-orange-500 rounded-md py-3 items-center"
                    >
                        <Text className="text-white font-semibold text-base">
                            Create Donation
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateEvent;
