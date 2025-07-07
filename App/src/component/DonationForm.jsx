import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from "../utils/axiosInstance";


const DonationForm = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const { eventId } = route.params;

    const [data, setData] = useState({
        donationDescription: '',
        quantity: '',
        donationPic: '',
        collectionAddress: '',
    });

    const [file, setFile] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    };

    const fileUploadFun = async () => {
        if (!file) {
            Alert.alert('Error', 'Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: file.uri,
            name: file.uri.split('/').pop(),
            type: 'image/jpeg',
        });

        const result = await axiosInstance.post('file-upload', formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return result?.data?.file?.filename;
    };

    const submitData = async () => {
        if ((data.donationDescription)==='') {
            Alert.alert('Validation Error', 'Donation description is required.');
            return;
        }
        if ((data.collectionAddress)==='') {
            Alert.alert('Validation Error', 'Collection address is required.');
            return;
        }

        const img = await fileUploadFun();
        if (!img) return;

        const fullData = { ...data, donationPic: img };
        const result = await axiosInstance.post(`${eventId}/donate`, fullData);

        if (result.data.status === true) {
            Alert.alert('Success', 'Donation submitted successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
            ]);
        } else {
            Alert.alert('Failed', 'Something went wrong during submission.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View className="bg-white p-5 rounded-xl shadow-md">
                    <Text className="text-2xl text-center text-orange-400 font-bold mb-4">
                        Donate Now
                    </Text>

                    <Text className="text-base text-orange-400 mb-1">Donation Description</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        value={data.donationDescription}
                        onChangeText={(text) => setData({ ...data, donationDescription: text })}
                        placeholder="Describe your donation"
                        className="border border-orange-400 rounded-md px-3 py-2 mb-4 text-sm text-gray-800"
                    />

                    <Text className="text-base text-orange-400 mb-1">Quantity</Text>
                    <TextInput
                        value={data.quantity}
                        onChangeText={(text) => setData({ ...data, quantity: text })}
                        placeholder="0"
                        keyboardType="numeric"
                        className="border border-orange-400 rounded-md px-3 py-2 mb-4 text-sm text-gray-800"
                    />

                    <Text className="text-base text-orange-400 mb-1">Collection Address</Text>
                    <TextInput
                        value={data.collectionAddress}
                        onChangeText={(text) => setData({ ...data, collectionAddress: text })}
                        placeholder="Enter address where we can collect donation"
                        className="border border-orange-400 rounded-md px-3 py-2 mb-4 text-sm text-gray-800"
                    />

                    <Text className="text-base text-orange-400 mb-1">Donation Picture</Text>
                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-orange-400 rounded-md py-2 px-4 mb-4"
                    >
                        <Text className="text-white text-center font-semibold">Select Image</Text>
                    </TouchableOpacity>

                    {file?.uri && (
                        <Image
                            source={{ uri: file.uri }}
                            style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 10 }}
                        />
                    )}

                    <TouchableOpacity
                        onPress={submitData}
                        className="bg-orange-500 rounded-md py-3 items-center"
                    >
                        <Text className="text-white font-semibold text-base">Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DonationForm;
