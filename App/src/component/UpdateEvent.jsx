import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { Picker } from '@react-native-picker/picker';
import axiosInstance from "../utils/axiosInstance";
import axiosImageInstance from "../utils/axiosImageInstance";

const UpdateEvent = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const { eventId } = route.params;

    const [file, setFile] = useState(null);
    const [donations, setDonations] = useState([]);
    const [formData, setFormData] = useState({
        donationId: '',
        description: '',
        areaName: '',
        status: '',
        title: '',
        bannerImg: ''
    });

    const fetchDonations = async () => {
        try {
            const res = await axiosInstance.get(`find-all-donations`);
            setDonations(res?.data?.data || []);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch donation list.');
        }
    };

    const fetchEventDetails = async () => {
        try {
            const res = await axiosInstance.get(`${eventId}/event`);
            const data = res?.data.data[0];
            if (data) {
                setFormData({
                    donationId: data?.donationDetails?._id,
                    description: data?.description,
                    areaName: data?.areaName,
                    status: data?.status,
                    title: data?.donationDetails?.title,
                    bannerImg: data?.bannerImg
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch event details.');
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchEventDetails();
            fetchDonations();
        }
    }, [isFocused]);

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

    const handleSubmit = async () => {
        try {
            let img = formData.bannerImg;
            if (file) {
                const uploadForm = new FormData();
                const localUri = file.uri;
                const fileName = localUri.split('/').pop();
                // Hardcode mime type as fallback
                const fileType = "image/jpeg";

                uploadForm.append("file", {
                    uri: localUri,
                    type: fileType,
                    name: fileName,
                });

                const result = await axiosImageInstance.post('/api/file-upload', uploadForm,{
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                img = result?.data?.file?.filename;
            }

            const payload = {
                donationId: formData.donationId,
                description: formData.description,
                areaName: formData.areaName,
                status: formData.status,
                bannerImg: img,
            };

            const res = await axiosInstance.put(`${eventId}/update-event`, payload);

            if (res.status >= 200 && res.status < 300) {
                Alert.alert('Success', 'Event updated successfully.', [
                    { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
                ]);
            } else {
                Alert.alert('Error', 'Failed to update event.');
            }
        } catch (error) {
            console.log('Update error:', error.response || error.message || error);
            Alert.alert('Error', 'Something went wrong during update.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View className="bg-white p-5 rounded-xl shadow-md">
                    <Text className="text-2xl text-orange-400 font-bold text-center mb-4">Update Donation Event</Text>

                    {/* Title Picker */}
                    <Text className="text-base text-orange-400 mb-1">Program</Text>
                    <View className="border border-orange-400 rounded-md mb-4">
                        <Picker
                            selectedValue={formData.donationId}
                            onValueChange={(value) =>
                                setFormData({ ...formData, donationId: value })
                            }
                        >
                            <Picker.Item label={formData.title || "Select Program"} value={formData.donationId} />
                            {donations.map((d) => (
                                <Picker.Item label={d.title} value={d._id} key={d._id} />
                            ))}
                        </Picker>
                    </View>

                    {/* Area Name */}
                    <Text className="text-base text-orange-400 mb-1">Area Name</Text>
                    <TextInput
                        value={formData.areaName}
                        onChangeText={(text) => setFormData({ ...formData, areaName: text })}
                        placeholder="Enter area"
                        className="border border-orange-400 rounded-md px-3 py-2 mb-4 text-sm text-gray-800"
                    />

                    {/* Description */}
                    <Text className="text-base text-orange-400 mb-1">Description</Text>
                    <TextInput
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Enter description"
                        multiline
                        numberOfLines={3}
                        className="border border-orange-400 rounded-md px-3 py-2 mb-4 text-sm text-gray-800"
                    />

                    {/* Status Picker */}
                    <Text className="text-base text-orange-400 mb-1">Status</Text>
                    <View className="border border-orange-400 rounded-md mb-4">
                        <Picker
                            selectedValue={formData.status}
                            onValueChange={(value) =>
                                setFormData({ ...formData, status: value })
                            }
                        >
                            <Picker.Item label="Select status" value="" />
                            <Picker.Item label="Pending" value="pending" />
                            <Picker.Item label="Running" value="running" />
                            <Picker.Item label="Finished" value="finished" />
                        </Picker>
                    </View>

                    {/* File Picker */}
                    <Text className="text-base text-orange-400 mb-1">Banner Image</Text>
                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-orange-400 rounded-md py-2 px-4 mb-4"
                    >
                        <Text className="text-white text-center font-semibold">Select New Image</Text>
                    </TouchableOpacity>

                    {file?.uri && (
                        <Image
                            source={{ uri: file.uri }}
                            style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 10 }}
                        />
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-orange-500 rounded-md py-3 items-center"
                    >
                        <Text className="text-white font-semibold text-base">Update</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UpdateEvent;
