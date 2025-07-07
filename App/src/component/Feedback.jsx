import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../utils/axiosInstance";
import {BaseURL} from "../utils/Config";


const Feedback = () => {
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);
    const isFocused = useIsFocused();

    const fetchFeedbacks = async () => {
        try {
            const res = await axiosInstance.get(`donorId/get-feedback`);
            if (res.data.status === true) {
                setFeedbacks(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
            Alert.alert("Error", "Could not fetch feedbacks");
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchFeedbacks();
        }
    }, [isFocused]);

    const handleSubmit = async () => {
        if (!message || !rating) {
            return Alert.alert("Warning", "Please fill out both message and rating");
        }

        try {
            const data = { message, rating };
            const response = await axiosInstance.post(`create-feedback`,data);
            if (response.data.status === true) {
                setMessage("");
                setRating("");
                fetchFeedbacks();
            } else {
                Alert.alert("Error", "Failed to submit feedback");
            }
        } catch (err) {
            console.error("Error submitting feedback:", err);
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-300 px-4 py-4">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Feedback Form */}
                <View className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <Text className="text-xl font-bold text-orange-500 mb-4">
                        Submit Feedback
                    </Text>

                    <TextInput
                        className="border border-orange-300 rounded-md p-3 mb-3 text-base text-gray-700"
                        placeholder="Write your feedback..."
                        multiline
                        numberOfLines={4}
                        value={message}
                        onChangeText={setMessage}
                    />

                    <View className="mb-3">
                        <Text className="mb-2 text-base">Select Rating</Text>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <TouchableOpacity
                                key={n}
                                onPress={() => setRating(n.toString())}
                                className={`p-3 rounded-md mb-2 ${
                                    rating === n.toString()
                                        ? "bg-orange-400"
                                        : "bg-gray-100 border border-orange-300"
                                }`}
                            >
                                <Text className="text-base">
                                    {n} - {["Very Bad", "Bad", "Okay", "Good", "Excellent"][n - 1]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-orange-500 py-3 rounded-md items-center"
                    >
                        <Text className="text-white font-bold text-base">Submit</Text>
                    </TouchableOpacity>
                </View>

                {/* Feedback List */}
                <View>
                    <Text className="text-2xl font-bold text-orange-500 mb-4">
                        Previous Feedbacks
                    </Text>

                    {feedbacks.length === 0 ? (
                        <Text className="text-base text-gray-700">No feedbacks found.</Text>
                    ) : (
                        feedbacks.map((fb) => (
                            <View
                                key={fb._id}
                                className="bg-white p-4 rounded-lg shadow-sm mb-4 flex-row space-x-4"
                            >
                                <Image
                                    source={{
                                        uri: `${BaseURL}/upload-file/${fb.donorImg}`,
                                    }}
                                    className="w-14 h-14 rounded-full border"
                                />
                                <View className="flex-1">
                                    <Text className="font-semibold text-base">
                                        {fb.donorFirstName} {fb.donorLastName}
                                    </Text>
                                    <Text className="text-sm text-gray-600">{fb.donorEmail}</Text>
                                    <Text className="text-sm text-gray-600">{fb.donorAddress}</Text>
                                    <Text className="mt-2 text-base">{fb.message}</Text>
                                    <Text className="text-yellow-600 mt-1">⭐ {fb.rating}/5</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Feedback;
