import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axiosInstance from "../utils/axiosInstance";
import { BaseURL } from "../utils/Config";
import UpdateDonation from "./UpdateDonation";
import {SafeAreaView} from "react-native-safe-area-context";

const AdminPending = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const donationList = await axiosInstance.get(`admin/accept-donation`);
            setDonations(donationList.data.data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchDonations();
        }
    }, [isFocused]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#f97316" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView
                className="px-4 pt-5"
                contentContainerStyle={{ paddingBottom: 50 }}
            >
            <View className="px-4">

                {donations.length > 0 ? (
                    donations.map((item) => (
                        <View key={item._id} className="bg-white rounded-lg p-4 mb-4 shadow">
                            <Text className="font-bold text-lg text-gray-700 mb-1">{item.Title}</Text>
                            <Text className="text-sm text-gray-500 mb-1">Type: {item.DonationType}</Text>
                            <Text className="text-sm text-gray-500 mb-1">
                                Date: {new Date(item.Create).toLocaleDateString('en-GB')}
                            </Text>

                            {/* Donor Info */}
                            <View className="flex-row items-center space-x-2 mb-2">
                                <Image
                                    source={{ uri: `${BaseURL}/upload-file/${item?.donorprofileImg}` }}
                                    className="w-10 h-10 rounded-md border border-orange-400"
                                />
                                <Text className="text-gray-700">
                                    {item?.donorFirstName} {item?.donorlastName} (Donor)
                                </Text>
                            </View>

                            {/* Volunteer Info */}
                            {item?.VolunteerFirstName?.length > 0 ? (
                                <View className="flex-row items-center space-x-2 mb-2">
                                    <Image
                                        source={{ uri: `${BaseURL}/upload-file/${item?.VolunteerprofileImg}` }}
                                        className="w-10 h-10 rounded-md border border-orange-400"
                                    />
                                    <Text className="text-gray-700">
                                        {item?.VolunteerFirstName} {item?.VolunteerlastName} (Volunteer)
                                    </Text>
                                </View>
                            ) : (
                                <Text className="italic text-gray-400 mt-2">No Assigned Volunteer</Text>
                            )}

                            <Text className="text-sm text-gray-600 mb-1">Location: {item.Location}</Text>

                            {/* Status */}
                            <Text
                                className={`text-white text-sm font-semibold rounded-full px-3 py-1 w-[50%] text-center mb-1 ${
                                    item.AdminRemark === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            >
                                Admin: {item.AdminRemark}
                            </Text>
                            <Text
                                className={`text-white text-sm font-semibold rounded-full px-3 py-1 w-[50%] text-center mb-3 ${
                                    item.VolunteerRemark === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            >
                                Volunteer: {item.VolunteerRemark}
                            </Text>

                            {/* Buttons */}
                            <View className="flex-row justify-between mt-2">
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('DonationDetails', { id: item._id })}
                                    className="flex-row items-center"
                                >
                                    <MaterialCommunityIcons name="information-outline" size={30} color="#24d18f" />
                                    <Text className="ml-1 text-sm text-[#24d18f]  font-bold">Details</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('UpdateDonation', { id: item._id })}
                                    className="flex-row items-center"
                                >
                                    <MaterialCommunityIcons name="file-document-edit-outline" size={20} color="#2563eb" />
                                    <Text className="ml-1 text-sm text-blue-600">Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-gray-500 mt-10">No Ongoing Events</Text>
                )}
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default AdminPending;
