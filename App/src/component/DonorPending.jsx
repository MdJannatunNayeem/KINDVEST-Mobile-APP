import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import axiosInstance from "../utils/axiosInstance";


const DonorPending = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const donationList = await axiosInstance.get(`donor/pending-donation`);
                setDonations(donationList.data.data);
            } catch (error) {
                console.error("Error fetching:", error);
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

    return (
        <ScrollView className="bg-gray-100 pt-5 px-4">
            <Text className="text-center text-2xl font-bold text-orange-400 mb-4 underline">
                Pending Donations
            </Text>

            {donations.length === 0 ? (
                <Text className="text-center text-gray-500 italic">No Pending Events</Text>
            ) : (
                donations.map((item) => (
                    <View key={item._id} className="bg-white rounded-md shadow p-4 mb-4 border-2 border-orange-300">
                        <Text className="text-lg font-bold text-gray-800 mb-1">{item.Title}</Text>
                        <Text className="text-gray-600">📍 {item.Location}</Text>
                        <Text className="text-gray-600">🎁 {item.DonationType}</Text>
                        <Text className="text-gray-600">
                            🗓️ {new Date(item.Create).toLocaleDateString('en-GB')}
                        </Text>

                        <Text className={`mt-2 px-2 py-1 rounded-full text-white text-center font-semibold ${
                            item.AdminRemark === 'pending' ? 'bg-yellow-500' : 'bg-green-600'
                        }`}>
                            Admin Remark: {item.AdminRemark}
                        </Text>

                        <View className="mt-3 flex-row items-center space-x-3">
                            {item?.VolunteerFirstName?.length > 0 ? (
                                <>
                                    <Image
                                        source={{ uri: `http://192.168.0.178:5050/upload-file/${item?.VolunteerprofileImg}` }}
                                        className="w-10 h-10 rounded-full border border-orange-300"
                                    />
                                    <Text className="text-gray-800">
                                        {item.VolunteerFirstName} {item.VolunteerlastName} {(Volunteer)}
                                    </Text>
                                </>
                            ) : (
                                <Text className="text-gray-500 italic">No Assigned Volunteer</Text>
                            )}
                        </View>

                        <Text className={`mt-2 px-2 py-1 rounded-full text-white text-center font-semibold ${
                            item.VolunteerRemark === 'pending' ? 'bg-yellow-500' : 'bg-green-600'
                        }`}>
                            Volunteer Remark: {item.VolunteerRemark}
                        </Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

export default DonorPending;
