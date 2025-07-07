import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from "../utils/axiosInstance";


const CreateDonation = () => {
    const navigation = useNavigation();
    const [data, setData] = useState({ title: '', description: '' });

    const isEmpty = (value) => !value || value.trim().length === 0;

    const submitData = async () => {
        if (isEmpty(data.title)) {
            Alert.alert("Validation Error", "Title is required.");
        } else if (isEmpty(data.description)) {
            Alert.alert("Validation Error", "Description is required.");
        } else {
            try {
                const result = await axiosInstance.post(`create-donation`, data);
                if (result.data.status === true) {
                    Alert.alert("Success", "Donation created successfully!", [
                        { text: "OK", onPress: () => navigation.navigate('Dashboard') }
                    ]);
                } else {
                    Alert.alert("Error", "Failed to create donation.");
                }
            } catch (err) {
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-center"
            >
                <ScrollView
                    contentContainerStyle={{ padding: 20, flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="bg-white p-5 rounded-xl shadow-lg">
                        <Text className="text-center text-2xl font-bold text-orange-400 mb-6">
                            Create a Donation Program
                        </Text>

                        <View className="mb-4">
                            <Text className="text-base font-medium text-orange-400 mb-1">
                                Title
                            </Text>
                            <TextInput
                                value={data.title}
                                onChangeText={(text) => setData({ ...data, title: text })}
                                placeholder="Enter title"
                                className="border border-orange-400 rounded-md px-3 py-2 text-sm text-gray-800"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-base font-medium text-orange-400 mb-1">
                                Description
                            </Text>
                            <TextInput
                                value={data.description}
                                onChangeText={(text) => setData({ ...data, description: text })}
                                placeholder="Write your description"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                className="border border-orange-400 rounded-md px-3 py-2 text-sm text-gray-800"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={submitData}
                            className="bg-orange-500 rounded-md py-3 items-center"
                        >
                            <Text className="text-white font-semibold text-base">
                                Create Donation
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateDonation;
