import React, {useEffect, useState} from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {Button, Text, TouchableOpacity, Image, View, Dimensions, ScrollView, Linking} from "react-native";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import axiosInstance from "../utils/axiosInstance";

const HomeScreen = ({ navigation }) => {
    const screenWidth = Dimensions.get('window').width;
    const [stats, setStats] = useState({ donors: 0, volunteers: 0, events: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get("/numbers-of-roles");
               // console.log(res.data.data);
                if (res.data.status) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };

        fetchStats();
    }, []);
    return (
        <ScrollView className="bg-white h-full ">

            {/* Image */}
            <Image
                source={require('../../assets/img.png') } // Replace with your image URL or local image
                className="w-full h-[300px] object-cover"


            />
            {/* Grid-like Flex Layout */}
            <SafeAreaView className="px-4 py-6">
                <View className="flex-row justify-between mb-6 gap-2">
                    <View className="flex-1 items-center p-3 border-2 border-orange-500 rounded-xl">
                        <Text className="text-lg font-semibold ">Donor</Text>
                        <FontAwesome name="user" size={70} color="#f97316" />
                        <Text className="text-sm font-semibold">{stats.donors}</Text>
                    </View>
                    <View className="flex-1 items-center p-3 border-2 border-orange-500 rounded-xl">
                        <Text className="text-lg font-semibold ">Volunteer</Text>
                        <FontAwesome name="users" size={70} color="#f97316" />
                        <Text className="text-sm font-semibold">{stats.volunteers}</Text>
                    </View>
                    <View className="flex-1 items-center p-3 border-2 border-orange-500 rounded-xl">
                        <Text className="text-lg font-semibold">Event</Text>
                        <MaterialIcons name="event-note" size={70} color="#f97316" />
                        <Text className="text-sm font-semibold">{stats.events}</Text>
                    </View>
                </View>

                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold mb-4 font-mono">About Us</Text>

                    {/* Horizontal Line */}
                    <View className="border-b-2 border-orange-500 mb-4" />



                    {/* Paragraph 1 */}
                    <Text className="text-gray-700 mb-4">
                        At <Text className="font-bold">KindVast</Text>, we believe in the power of kindness and
                        collective action to create a better world. Our mission is to connect compassionate individuals{' '}
                        <Text className="text-red-500">●</Text> with meaningful opportunities to donate, volunteer, and
                        support causes that transform lives.
                    </Text>

                    {/* Paragraph 2 */}
                    <Text className="text-gray-700 mb-4">
                        Through transparency, inclusivity, and community-driven initiatives, we aim to inspire
                        generosity and foster lasting impact. Join us in building a kinder, more compassionate world —{' '}
                        <Text className="text-sky-500">“one act of kindness at a time”.</Text>
                    </Text>
                </View>

                {/* Navigation Button */}


                <View className="px-6 py-10 bg-gray-900 rounded-xl">
                    {/* Top Grid */}
                    <View className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Logo & Desc */}
                        <View>
                            <View className="flex-row items-center mb-4">
                                <Image
                                    source={require('../../assets/img_2.png')}
                                    style={{ width: 32, height: 32 }}
                                />
                                <Text className="text-white text-xl font-bold ml-2">KindVest</Text>
                            </View>
                            <Text className="text-gray-400 text-sm mb-2">
                                A platform to help those in need{'\n'}those who want to help
                            </Text>
                            <Text className="text-gray-600 text-sm mb-2">Follow us:</Text>
                            <View className="flex-row space-x-4">
                                <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
                                    <Ionicons name="logo-twitter" size={24} color="#FFA500" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL('https://youtube.com')}>
                                    <Ionicons name="logo-youtube" size={24} color="#FFA500" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
                                    <Ionicons name="logo-instagram" size={24} color="#FFA500" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
                                    <Ionicons name="logo-facebook" size={24} color="#FFA500" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* About Website */}
                        <View>
                            <Text className="text-white font-semibold mb-4">About website</Text>
                            {['About us', 'Activity', 'Testimonials', 'Contact us'].map((item) => (
                                <TouchableOpacity key={item} className="mb-2">
                                    <Text className="text-gray-400 text-sm hover:text-orange-500">
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Services */}
                        <View>
                            <Text className="text-white font-semibold mb-4">Services</Text>
                            {['Opportunity', 'Volunteer service', 'Give education'].map((item) => (
                                <TouchableOpacity key={item} className="mb-2">
                                    <Text className="text-gray-400 text-sm">{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Contact Info */}
                        <View>
                            <Text className="text-white font-semibold mb-4">Contact info:</Text>
                            <View className="flex-row items-center mb-2">
                                <MaterialIcons name="phone" size={20} color="#FFA500" />
                                <Text className="text-gray-400 text-sm ml-2">01987654321</Text>
                            </View>
                            <View className="flex-row items-center">
                                <MaterialIcons name="email" size={20} color="#FFA500" />
                                <Text className="text-gray-400 text-sm ml-2">kindvast@help.bd</Text>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="border-t border-gray-700 mt-10" />

                    {/* Bottom Row */}
                    <View className="mt-6 flex-col md:flex-row justify-between items-center">
                        <Text className="text-gray-400 text-sm">2025 © Donation & Volunteer</Text>
                        <View className="flex-row space-x-6 mt-4 md:mt-0">
                            {['Terms & Condition', 'Privacy Policy', 'Contact us'].map((item) => (
                                <TouchableOpacity key={item}>
                                    <Text className="text-gray-400 text-sm">{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            <StatusBar style="light" />
        </ScrollView>
    );
};

export default HomeScreen;
