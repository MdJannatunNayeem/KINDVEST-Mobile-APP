import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
    token: null,
    user: null,
    role:null,
    login: async (token, user,role) => {
        await AsyncStorage.setItem('token', JSON.stringify(token));
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('role', JSON.stringify(role));
        set({ token, user ,role});
    },

    loadUser: async (user) => {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        set({ user});
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('role');
        set({ token: null, user: null ,role: null });
    },

    loadToken: async () => {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        const role = await AsyncStorage.getItem('role');

        if (token && user) {
            set({ token: JSON.parse(token), user: JSON.parse(user),role: JSON.parse(role) });
        }
    },
}));

export default useAuthStore;
