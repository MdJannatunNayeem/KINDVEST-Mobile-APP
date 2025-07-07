import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import axiosInstance from "../utils/axiosInstance";

const DonorDashboard = () => {
    const [inform, setInform] = useState({});
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            try {
                const result = await axiosInstance.get(`donor-dashboard-stat`);
                setInform(result.data.data);
            } catch (error) {
                console.error('Error fetching:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#f97316" />
            </View>
        );
    }

    const Card = ({ icon, label, value, onPress, iconColor = '#f97316' }) => (
        <View className="bg-white rounded-xl p-5 m-2 shadow-lg border border-gray-200 w-[90%] self-center">
            <View className="flex-row items-center justify-center mb-2 space-x-2">
                {icon}
                <Text className="text-[15px] font-semibold text-gray-800">{label}</Text>
            </View>
            <Text className="text-center text-xl font-bold text-gray-700 mb-2">{value}</Text>
            <TouchableOpacity
                onPress={onPress}
                className="bg-blue-500 py-1 px-3 rounded-md self-end"
            >
                <Text className="text-white text-xs font-bold">Details</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView className="bg-gray-100 py-5">
            <View className="px-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-gray-800">Donor Dashboard</Text>
                    <Icon name="notifications" size={30} color="#f97316" />
                </View>

                <Card
                    icon={<FontAwesome5 name="check-circle" size={24} color="#22c55e" />}
                    label="Total Donation Approved"
                    value={inform.DonorAccepted}
                    onPress={() => navigation.navigate('Total Approvre Donation')}
                />

                <Card
                    icon={<MaterialIcons name="pending-actions" size={24} color="#f43f5e" />}
                    label="Total Pending Donation"
                    value={inform.DonorPending}
                    onPress={() => navigation.navigate(`Total Pending Donation`)}
                />

                <Card
                    icon={<Entypo name="check" size={24} color="#3b82f6" />}
                    label="Total Complete Donation"
                    value={inform.DonorReceived}
                    onPress={() => navigation.navigate('Total Complete Donation')}
                />
            </View>
        </ScrollView>
    );
};

export default DonorDashboard;
