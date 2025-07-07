//import { StatusBar } from 'expo-status-bar';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {Button, Keyboard, Text,Image, TouchableOpacity, View} from 'react-native';
import "./global.css";
//import './gesture-handler';
//import {SafeAreaProvider, SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
//import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "./src/component/HomeScreen";
import LoginScreen from "./src/component/LoginScreen";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HeroSection from "./src/component/HeroSection";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useEffect, useState} from "react";
import RegisterScreen from "./src/component/RegisterScreen";
import useAuthStore from "./src/store/authSotre";
import ProfileSection from "./src/component/ProfileSection";
import {BaseURL} from "./src/utils/Config";
import DonorOnGoing from "./src/component/DonorOnGoing";
import DonorPending from "./src/component/DonorPending";
import DonorComplete from "./src/component/DonorComplete";
import DonorDashboard from "./src/component/DonorDashboard";
import VolunteerReceived from "./src/component/VolunteerReceived";
import VolunteerPending from "./src/component/VolunteerPending";
import VolunteerDelivery from "./src/component/VolunteerDelivery";
import VolunteerDashboard from "./src/component/VolunteerDashboard";
import AdminPending from "./src/component/AdminPending";
import DonationDetails from "./src/component/DonationDetails";
import UpdateDonation from "./src/component/UpdateDonation";
import AdminAccept from "./src/component/AdminAccept";
import AdminCompletion from "./src/component/AdminCompletion";
import AdminDashboard from "./src/component/AdminDashboard";
import CreateDonation from "./src/component/CreateDonation";
import CreateEvent from "./src/component/CreateEvent";
import OnGoingEvents from "./src/component/OnGoingEvents";
import UpdateEvent from "./src/component/UpdateEvent";
import Activity from "./src/component/Activity";
import DonationForm from "./src/component/DonationForm";
import Feedback from "./src/component/Feedback";
import VolunteerList from "./src/component/VolunteerList";


const Tab = createBottomTabNavigator();
//const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//for donor
const DonorStack = () => {
    const { user } = useAuthStore();// changed from profile to user



    const CustomDrawerContent = (props) => (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: '#00061a',
                    paddingTop: 60,
                    paddingBottom: 20,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                }}
            >
                <Image
                    source={{ uri: `${BaseURL}/upload-file/${user?.profileImg}` }}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        borderWidth: 2,
                        borderColor: '#fff',
                        marginBottom: 10,
                    }}
                />
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text style={{ color: '#ccc', fontSize: 14 }}>{user?.email}</Text>
            </View>

            <DrawerContentScrollView {...props} style={{ backgroundColor: '#f0f0f0' }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: '#00061a' },
                headerTintColor: '#fff',
                drawerStyle: { backgroundColor: '#f0f0f0' },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.toggleDrawer()}
                        style={{ marginLeft: 15 }}
                    >
                        <Image
                            source={{ uri: `${BaseURL}/upload-file/${user?.profileImg}` }}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: '#fff',
                            }}
                        />
                    </TouchableOpacity>
                ),
            })}
        >

            <Drawer.Screen name="Dashboard" component={DonorDashboard} />
            <Drawer.Screen name="Home" component={HeroSection} />
            <Drawer.Screen name="Activity" component={Activity} />
            <Drawer.Screen name="Feedback" component={Feedback} />
            <Drawer.Screen name="Profile" component={ProfileSection} />
            <Drawer.Screen name="Total Approvre Donation" component={DonorOnGoing} />
            <Drawer.Screen name="Total Pending Donation" component={DonorPending} />
            <Drawer.Screen name="Total Complete Donation" component={DonorComplete} />
            <Drawer.Screen name="Logout" component={LogoutScreenPlaceholder} options={{
                drawerLabel: ({  color }) => (
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Logout</Text>
                ),
            }}/>

            <Drawer.Screen name="DonationForm" component={DonationForm}
                options={{
                    drawerLabel: () => null,          // hides label
                    title: null,                      // hides title
                    drawerIcon: () => null,          // hides icon
                    headerShown:false,// hides header if you want
                }}
            />
        </Drawer.Navigator>
    );
};


//for vol
const VolunteerStack = () => {
    const { user } = useAuthStore();// changed from profile to user



    const CustomDrawerContent = (props) => (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: '#00061a',
                    paddingTop: 60,
                    paddingBottom: 20,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                }}
            >
                <Image
                    source={{ uri: `http://192.168.0.178:5050/upload-file/${user?.profileImg}` }}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        borderWidth: 2,
                        borderColor: '#fff',
                        marginBottom: 10,
                    }}
                />
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text style={{ color: '#ccc', fontSize: 14 }}>{user?.email}</Text>
            </View>

            <DrawerContentScrollView {...props} style={{ backgroundColor: '#f0f0f0' }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: '#00061a' },
                headerTintColor: '#fff',
                drawerStyle: { backgroundColor: '#f0f0f0' },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.toggleDrawer()}
                        style={{ marginLeft: 15 }}
                    >
                        <Image
                            source={{ uri: `${BaseURL}/upload-file/${user?.profileImg}` }}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: '#fff',
                            }}
                        />
                    </TouchableOpacity>
                ),
            })}
        >

            <Drawer.Screen name="Dashboard" component={VolunteerDashboard} />
            <Drawer.Screen name="Home" component={HeroSection} />
            <Drawer.Screen name="Activity" component={Activity} />
            <Drawer.Screen name="Feedback" component={Feedback} />
            <Drawer.Screen name="Profile" component={ProfileSection} />
            <Drawer.Screen name="Total Received Donation" component={VolunteerReceived} />
            <Drawer.Screen name="New Delivery Request" component={VolunteerPending} />
            <Drawer.Screen name="Total Delivered Donation" component={VolunteerDelivery} />
            <Drawer.Screen name="Logout" component={LogoutScreenPlaceholder} />
        </Drawer.Navigator>
    );
};


const LogoutScreenPlaceholder = () => {
    const { logout } = useAuthStore();
    useEffect(() => {
        logout();
    }, []);
    return null;
};

//for admin
const AdminStack = () => {
    const { user } = useAuthStore();// changed from profile to user



    const CustomDrawerContent = (props) => (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: '#00061a',
                    paddingTop: 60,
                    paddingBottom: 20,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                }}
            >
                <Image
                    source={{ uri: `http://192.168.0.178:5050/upload-file/${user?.profileImg}` }}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        borderWidth: 2,
                        borderColor: '#fff',
                        marginBottom: 10,
                    }}
                />
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    {user?.firstName} {user?.lastName}
                </Text>
                <Text style={{ color: '#ccc', fontSize: 14 }}>{user?.email}</Text>
            </View>

            <DrawerContentScrollView {...props} style={{ backgroundColor: '#f0f0f0' }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: '#00061a' },
                headerTintColor: '#fff',
                drawerStyle: { backgroundColor: '#f0f0f0' },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.toggleDrawer()}
                        style={{ marginLeft: 15 }}
                    >
                        <Image
                            source={{ uri: `${BaseURL}/upload-file/${user?.profileImg}` }}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: '#fff',
                            }}
                        />
                    </TouchableOpacity>
                ),
            })}
        >

            <Drawer.Screen name="Dashboard" component={AdminDashboard} />
            <Drawer.Screen name="Home" component={HeroSection} />
            <Drawer.Screen name="Activity" component={Activity} />
            <Drawer.Screen name="Feedback" component={Feedback} />
            <Drawer.Screen name="Profile" component={ProfileSection} />
            <Drawer.Screen name="Volunteer List" component={VolunteerList} />
            <Drawer.Screen name="On Going Donation" component={AdminAccept} />
            <Drawer.Screen name="New Pending Request" component={AdminPending} />
            <Drawer.Screen name="Total Completed Donation" component={AdminCompletion} />
            <Drawer.Screen name="Create a Program" component={CreateDonation} />
            <Drawer.Screen name="Select a Program" component={CreateEvent} />
            <Drawer.Screen name="On Going Program Progress" component={OnGoingEvents} />
            <Drawer.Screen name="Logout" component={LogoutScreenPlaceholder} />
            <Drawer.Screen
                name="DonationDetails"
                component={DonationDetails}
                options={{
                    drawerLabel: () => null,          // hides label
                    title: null,                      // hides title
                    drawerIcon: () => null,          // hides icon
                    headerShown: false,              // hides header if you want
                }}
            />
            <Drawer.Screen
                name="UpdateDonation"
                component={UpdateDonation}
                options={{
                    drawerLabel: () => null,          // hides label
                    title: null,                      // hides title
                    drawerIcon: () => null,          // hides icon
                    headerShown: false,              // hides header if you want
                }}
            />

            <Drawer.Screen
                name="UpdateEvent"
                component={UpdateEvent}
                options={{
                    drawerLabel: () => null,          // hides label
                    title: null,                      // hides title
                    drawerIcon: () => null,          // hides icon
                    headerShown: false,              // hides header if you want
                }}
            />
        </Drawer.Navigator>
    );
};

const GuestTabs = ({ keyboardVisible }) => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: keyboardVisible
                ? { display: 'none' }
                : {
                    backgroundColor: '#00061a',
                    borderRadius: 10,
                    height: 75,
                    marginBottom: 50,
                    marginHorizontal: 2,
                },
            tabBarActiveTintColor: '#edd602',
            tabBarInactiveTintColor: '#fff',
            tabBarShowLabel: true,
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: {
                fontSize: 14,
                fontFamily: 'Georgia',
                fontWeight: 'normal',
            },
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                else if (route.name === 'Login') iconName = focused ? 'person' : 'person-outline';
                else if (route.name === 'Activity') iconName = focused ? 'list' : 'list-outline';
                else if (route.name === 'Register') iconName = focused ? 'create' : 'create-outline';

                return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}
    >
        <Tab.Screen name="Home" component={HeroSection} />
        <Tab.Screen name="Activity" component={Activity} />

        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
    </Tab.Navigator>
);

export default function App() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const { token, loadToken, role } = useAuthStore();

    useEffect(() => {
        loadToken();

        const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    return (
        <NavigationContainer>
            {!token ? (
                <GuestTabs keyboardVisible={keyboardVisible} />
            ) : role === 'donor' ? (
                <DonorStack />
            ) : role === 'volunteer' ? (
                <VolunteerStack /> // You can replace this with an "AdminStack" or "ReceiverStack"
            ) : (
                <AdminStack />

                // You can replace this with an "AdminStack" or "ReceiverStack"
            )}
        </NavigationContainer>
    );
}