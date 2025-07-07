import React, { useEffect, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { BaseURL } from "../utils/Config";
import axiosInstance from "../utils/axiosInstance";

const VolunteerDelivery = () => {
    const [donations, setDonations] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const donationList = await axiosInstance.get(`volunteer/delivered-donation`);
            setDonations(donationList.data.data);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchDonations();
        }
    }, [isFocused]);

    const updateVolRemark = async (id, status) => {
        try {
            await axiosInstance.post(`${id}/update-volunteer-remark/${status}`);
            Alert.alert("Updated", `Status changed to ${status}`);
            fetchDonations(); // Reload after update
        } catch (err) {
            Alert.alert("Error", "Failed to update status");
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#f97316" />
            </View>
        );
    }

    return (
        <ScrollView className="bg-gray-100 py-5">
            <View className="px-4">
                <Text className="text-2xl font-bold text-center text-gray-800 mb-5">
                    Total Delivery Donations
                </Text>

                {donations.length > 0 ? (
                    donations.map((item) => (
                        <View key={item._id} className="bg-white rounded-lg p-4 mb-4 shadow">
                            <Text className="font-bold text-lg text-gray-700 mb-1">{item.Title}</Text>
                            <Text className="text-sm text-gray-500 mb-1">Type: {item.DonationType}</Text>
                            <Text className="text-sm text-gray-500 mb-1">
                                Date: {new Date(item.Create).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            })}
                            </Text>

                            <View className="flex-row items-center space-x-2 mb-2">
                                <Image
                                    source={{ uri: `${BaseURL}/upload-file/${item?.donorprofileImg}` }}
                                    className="w-10 h-10 rounded-md border border-orange-400"
                                />
                                <Text className="text-gray-700">
                                    {item?.donorFirstName} {item?.donorlastName} (Donor)
                                </Text>
                            </View>

                            <Text className="text-sm text-gray-600 mb-1">Location: {item.Location}</Text>

                            <Text
                                className={`text-white text-sm font-semibold rounded-full px-3 py-1 w-[50%] text-center mb-1 ${
                                    item.AdminRemark === "pending" ? "bg-yellow-500" : "bg-green-500"
                                }`}
                            >
                                Admin: {item.AdminRemark}
                            </Text>

                            <Text
                                className={`text-white text-sm font-semibold rounded-full px-3 py-1 w-[50%] text-center mb-2 ${
                                    item.VolunteerRemark === "pending" ? "bg-yellow-500" : "bg-green-500"
                                }`}
                            >
                                Volunteer: {item.VolunteerRemark}
                            </Text>

                            {editingId === item._id ? (
                                <Picker
                                    selectedValue=""
                                    onValueChange={(value) => {
                                        if (value) {
                                            updateVolRemark(item._id, value);
                                            setEditingId(null);
                                        }
                                    }}
                                    mode="dropdown"
                                >
                                    <Picker.Item label="Select Status" value="" />
                                    <Picker.Item label="Pending" value="pending" />
                                    <Picker.Item label="Rejected" value="rejected" />
                                    <Picker.Item label="Received" value="received" />
                                    <Picker.Item label="Delivered" value="delivered" />
                                </Picker>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setEditingId(item._id)}
                                    className="flex-row items-center self-end mt-2"
                                >
                                    <MaterialIcons name="edit" size={20} color="#2563eb" />
                                    <Text className="ml-1 text-sm text-blue-600">Edit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-gray-500 mt-10">No Delivered Events Found</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default VolunteerDelivery;
