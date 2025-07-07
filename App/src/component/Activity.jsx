import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Image,
    TouchableOpacity,
    Pressable
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axiosInstance from "../utils/axiosInstance";
import {BaseURL} from "../utils/Config";
import useAuthStore from "../store/authSotre";


const Activity = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const {role}=useAuthStore();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [titles, setTitles] = useState([]);
    const [searchText, setSearchText] = useState('');

    const fetchActivities = async () => {
        try {
            const res = await axiosInstance.get(`activity`);
            const data = res.data.data || [];
            setEvents(data);
            setFilteredEvents(data);

            const availableLocations = [...new Set(data.map(e => e.areaName))];
            const availableTitles = [...new Set(data.map(e => e.donationDetails.title))];

            setLocations(availableLocations);
            setTitles(availableTitles);
        } catch (error) {
            console.log('Error fetching activities:', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchActivities();
        }
    }, [isFocused]);

    useEffect(() => {
        const result = events.filter(
            event =>
                event.donationDetails.title.toLowerCase().includes(searchText.toLowerCase()) ||
                event.areaName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredEvents(result);
    }, [searchText, events]);

    const handleFilter = (key, value) => {
        let result = [];
        if (key === 'title') {
            result = events.filter(event => event.donationDetails.title === value);
        } else {
            result = events.filter(event => event.areaName === value);
        }
        setFilteredEvents(result);
    };

    return (
        <ScrollView className="bg-gray-100 px-4 pt-4 mt-5"
                    contentContainerStyle={{ paddingBottom: 60 }}
        >
            <TextInput
                placeholder="Search by title or location"
                value={searchText}
                onChangeText={setSearchText}
                className="bg-white border border-gray-400 rounded-md px-4 py-2 mb-4"
            />

            {/* Filter Section */}
            <View className="mb-6">
                <Text className="text-lg font-bold mb-2">Filter by Location</Text>
                <View className="flex-row flex-wrap">
                    {locations.map(loc => (
                        <Pressable
                            key={loc}
                            onPress={() => handleFilter('areaName', loc)}
                            className="bg-orange-200 px-3 py-1 rounded-full mr-2 mb-2"
                        >
                            <Text className="text-sm font-medium">{loc}</Text>
                        </Pressable>
                    ))}
                </View>

                <Text className="text-lg font-bold mb-2 mt-4">Filter by Title</Text>
                <View className="flex-row flex-wrap">
                    {titles.map(title => (
                        <Pressable
                            key={title}
                            onPress={() => handleFilter('title', title)}
                            className="bg-green-200 px-3 py-1 rounded-full mr-2 mb-2"
                        >
                            <Text className="text-sm font-medium">{title}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Cards */}
            <View className="gap-y-4">
                {filteredEvents.map(event => (
                    <View
                        key={event._id}
                        className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-300"
                    >
                        <Image
                            source={{ uri: `${BaseURL}/upload-file/${event.bannerImg}` }}
                            className="w-full h-48"
                            resizeMode="cover"
                        />
                        <View className="p-4">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="font-bold text-base flex-shrink">{event.donationDetails.title}</Text>
                                <Text className="text-sm text-gray-600">
                                    {new Date(event.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </View>
                            <Text className="text-sm mb-2">{event.description}</Text>
                            <Text className="text-sm text-cyan-700 mb-1">Location: {event.areaName}</Text>
                            <Text className="text-sm text-green-700 mb-2">Status: {event.status}</Text>
                            { role === 'donor' && (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('DonationForm', { eventId: event._id })}
                                    className="bg-blue-950 px-4 py-2 rounded-full mt-auto"
                                >
                                    <Text className="text-white text-center font-semibold">Donate</Text>
                                </TouchableOpacity>
                            ) }

                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default Activity;
