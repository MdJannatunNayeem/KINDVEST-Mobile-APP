import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import axiosInstance from "../utils/axiosInstance";

const OnGoingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`on-going-events`);
            setEvents(res.data.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchEvents();
        }
    }, [isFocused]);

    const formatDate = (dateStr) => {
        const options = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        return new Date(dateStr).toLocaleDateString('en-GB', options);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#f97316" />
                </View>
            ) : (
                <ScrollView className="p-4">
                    <Text className="text-2xl font-bold text-gray-700 text-center mb-4 font-mono">
                        On Going Donations
                    </Text>

                    {events.length > 0 ? (
                        events.map((event) => (
                            <View
                                key={event._id}
                                className="bg-white p-4 rounded-xl mb-4 shadow-md"
                            >
                                <Text className="text-lg font-bold text-orange-500 mb-1">
                                    {event?.donationDetails?.title}
                                </Text>
                                <Text className="text-gray-600 mb-1">
                                    Description: {event.description}
                                </Text>
                                <Text className="text-gray-600 mb-1">
                                    Created: {formatDate(event.createdAt)}
                                </Text>
                                <Text className="text-gray-600 mb-1">
                                    Area: {event.areaName}
                                </Text>
                                <Text
                                    className={`text-white text-center px-3 py-1 rounded-full self-start mb-2 ${
                                        event.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                >
                                    {event.status}
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('UpdateEvent', {
                                            eventId: event._id,
                                        })
                                    }
                                    className="flex-row items-center self-end mt-2"
                                >
                                    <MaterialIcons name="edit" size={20} color="#f97316" />
                                    <Text className="ml-1 text-orange-500 font-semibold">Edit</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text className="text-center text-gray-500 mt-10">
                            No Ongoing Events
                        </Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default OnGoingEvents;
