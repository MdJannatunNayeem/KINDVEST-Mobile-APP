import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axiosInstance from '../utils/axiosInstance';
import { Picker } from '@react-native-picker/picker';
import {SafeAreaView} from "react-native-safe-area-context";

const UpdateDonation = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;

    const [formData, setFormData] = useState({
        volunteerId: '',
        AdminRemark: '',
    });

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await axiosInstance.get(`volunteers`);
                setVolunteers(response.data.data || []);
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            }
        };
        fetchVolunteers();
    }, []);

    const handleSubmit = async () => {
        if (!formData.volunteerId || !formData.AdminRemark) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const requestBody = {
                volunteerId: formData.volunteerId,
                AdminRemark: formData.AdminRemark,
            };

            const response = await axiosInstance.post(`${id}/update-manage-donation`,requestBody);

            if (response.status) {
                Alert.alert('Success', 'Updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert('Error', 'Failed to update');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">

        <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#f3f4f6', flexGrow: 1 }}>
            <Text className="text-2xl font-bold text-center text-orange-500 mb-6">Update Donation Event</Text>

            <View className="mb-4">
                <Text className="text-orange-500 font-medium mb-2">Assign a Volunteer</Text>
                <View className="border border-orange-400 rounded-md">
                    <Picker
                        selectedValue={formData.volunteerId}
                        onValueChange={(value) => setFormData({ ...formData, volunteerId: value })}
                    >
                        <Picker.Item label="Select Volunteer" value="" />
                        {volunteers.map((v) => (
                            <Picker.Item
                                key={v._id}
                                label={`${v.firstName} ${v.lastName}`}
                                value={v._id}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            <View className="mb-4">
                <Text className="text-orange-500 font-medium mb-2">Admin Remark</Text>
                <View className="border border-orange-400 rounded-md">
                    <Picker
                        selectedValue={formData.AdminRemark}
                        onValueChange={(value) => setFormData({ ...formData, AdminRemark: value })}
                    >
                        <Picker.Item label="Select Status" value="" />
                        <Picker.Item label="Pending" value="pending" />
                        <Picker.Item label="Accepted" value="accepted" />
                        <Picker.Item label="Received" value="received" />
                        <Picker.Item label="Rejected" value="rejected" />
                    </Picker>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-orange-500 py-3 rounded-md mt-4"
                disabled={loading}
            >
                <Text className="text-center text-white font-bold text-lg">
                    {loading ? 'Updating...' : 'Update'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
        </SafeAreaView>
    );
};

export default UpdateDonation;
