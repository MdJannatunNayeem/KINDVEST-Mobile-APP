import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../utils/axiosInstance";

const VolunteerDashboard = () => {
    const [inform, setInform] = useState({});
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // 👈 Track tab/screen focus

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const result = await axiosInstance.get(`volunteer-dashboard-stat`);
            setInform(result.data.data);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Fetch when screen is focused
    useEffect(() => {
        if (isFocused) {
            fetchDashboardData();
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
        <ScrollView className="bg-white px-4 py-6">
            <View className="flex-row justify-between items-center mb-5">
                <Text className="text-2xl font-bold text-gray-800">Volunteer Dashboard</Text>
                <Ionicons name="notifications" size={28} color="#ea580c" />
            </View>

            {/* Card: Delivered */}
            <View className="bg-gray-100 rounded-xl p-4 mb-4 border border-gray-200 shadow-md">
                <View className="flex-row items-center justify-center mb-2 space-x-2">
                    <Ionicons name="gift" size={30} color="#ea580c" />
                    <Text className="text-sm font-semibold">Total Donation Delivered</Text>
                </View>
                <Text className="text-xl text-center my-2">{inform.delivered}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Total Delivered Donation")}
                    className="bg-blue-400 py-2 px-3 rounded-md self-end"
                >
                    <Text className="text-white text-xs font-semibold">Details</Text>
                </TouchableOpacity>
            </View>

            {/* Card: Pending */}
            <View className="bg-gray-100 rounded-xl p-4 mb-4 border border-gray-200 shadow-md">
                <View className="flex-row items-center justify-center mb-2 space-x-2">
                    <Ionicons name="briefcase-outline" size={30} color="#14b8a6" />
                    <Text className="text-sm font-semibold">New Delivery Request</Text>
                </View>
                <Text className="text-xl text-center my-2">{inform.pending}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("New Delivery Request")}
                    className="bg-blue-400 py-2 px-3 rounded-md self-end"
                >
                    <Text className="text-white text-xs font-semibold">Details</Text>
                </TouchableOpacity>
            </View>

            {/* Card: Received */}
            <View className="bg-gray-100 rounded-xl p-4 mb-4 border border-gray-200 shadow-md">
                <View className="flex-row items-center justify-center mb-2 space-x-2">
                    <Ionicons name="timer" size={30} color="#22c55e" />
                    <Text className="text-sm font-semibold">Yet Not Received Donation By Admin</Text>
                </View>
                <Text className="text-xl text-center my-2">{inform.received}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Total Received Donation")}
                    className="bg-blue-400 py-2 px-3 rounded-md self-end"
                >
                    <Text className="text-white text-xs font-semibold">Details</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default VolunteerDashboard;
