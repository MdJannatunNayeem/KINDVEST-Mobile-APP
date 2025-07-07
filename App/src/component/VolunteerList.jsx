import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {BaseURL} from "../utils/Config";
import axiosInstance from "../utils/axiosInstance";

const VolunteerList = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            fetchVolunteers();
        }
    }, [isFocused]);

    const fetchVolunteers = async () => {
        try {
            const response = await axiosInstance.get(`all-volunteers`);
            if (response.data.data) {
                setVolunteers(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch volunteers", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-300 p-4">
            <View className="flex-col  w-full  space-y-4 ">
                {/* Volunteer List */}
                <View className="w-full  bg-gray-700 rounded-2xl shadow-md p-4">
                    <Text className="text-xl text-white font-bold mb-4">Volunteers</Text>
                    <ScrollView>
                        {volunteers.map((volunteer) => (
                            <TouchableOpacity
                                key={volunteer._id}
                                onPress={() => setSelectedVolunteer(volunteer)}
                                className="p-2 border-b border-gray-500 hover:bg-blue-400"
                            >
                                <View className="flex-row items-center space-x-3">
                                    <Image
                                        source={{
                                            uri: `${BaseURL}/upload-file/${volunteer.profileImg}`,
                                        }}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <Text className="text-white">
                                        {volunteer.firstName} {volunteer.lastName}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Volunteer Details */}
                <View className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6">
                    {selectedVolunteer ? (
                        <>
                            <Text className="text-2xl font-bold mb-4">Volunteer Info</Text>
                            <Image
                                source={{
                                    uri: `${BaseURL}/upload-file/${selectedVolunteer.profileImg}`,
                                }}
                                className="w-40 h-32 rounded-md mb-4"
                            />
                            <Text>
                                <Text className="font-bold">Name: </Text>
                                {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                            </Text>
                            <Text>
                                <Text className="font-bold">Email: </Text>
                                {selectedVolunteer.email}
                            </Text>
                            <Text>
                                <Text className="font-bold">Address: </Text>
                                {selectedVolunteer.address}
                            </Text>
                            <Text>
                                <Text className="font-bold">Phone: </Text>
                                {selectedVolunteer.contactNo}
                            </Text>
                            <Text className="mt-2">
                                <Text className="font-bold">Join Date: </Text>
                                <Text className="font-mono text-sm">
                                    {new Date(selectedVolunteer.createdAt).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </Text>
                            </Text>
                        </>
                    ) : (
                        <Text className="text-gray-500">Select a volunteer to see details</Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default VolunteerList;
