import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../utils/axiosInstance';
import { BaseURL } from '../utils/Config';

const DonationDetails = () => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { id } = route.params;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axiosInstance.get(`donation-details/${id}`);
                setDetail(response.data.data[0]);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#f97316" />
            </SafeAreaView>
        );
    }

    if (!detail) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Text>No data found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="p-4">
                <Text className="text-xl font-bold text-gray-800 mb-3">Donation Details</Text>

                <View className="bg-white rounded-xl p-4 mb-4 shadow">
                    <Text className="text-lg font-semibold mb-2">Donor Information</Text>
                    <View className="flex-row items-center mb-2">
                        <Image
                            source={{ uri: `${BaseURL}/upload-file/${detail?.donorprofileImg}` }}
                            className="w-14 h-14 rounded-md border border-orange-300"
                        />
                        <View className="ml-3">
                            <Text>{detail?.donorFirstName} {detail?.donorlastName}</Text>
                            <Text>{detail?.donorEmail}</Text>
                            <Text>{detail?.donorContact}</Text>
                        </View>
                    </View>
                    <Text className="text-sm text-gray-600">Address: {detail?.donorAddress}</Text>
                    <Text className="text-sm text-gray-600 mt-1">Collection: {detail?.DonationCollectionAddress}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow">
                    <Text className="text-lg font-semibold mb-2">Donation Info</Text>
                    <Text className="mb-1">Title: {detail?.Title}</Text>
                    <Text className="mb-1">Type: {detail?.DonationType}</Text>
                    <Text className="mb-1">Quantity: {detail?.Quantity}</Text>
                    <Text className="mb-1">Request Date: {detail?.requestDate}</Text>
                    <Image
                        source={{ uri: `${BaseURL}/upload-file/${detail?.DonationPic}` }}
                        className="w-full h-40 rounded-md border border-orange-300 mt-2"
                        resizeMode="cover"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DonationDetails;
