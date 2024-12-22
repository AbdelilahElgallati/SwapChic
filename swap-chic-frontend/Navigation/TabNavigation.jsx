import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../app/(tabs)/HomeScreen';
import ProfileScreen from '../app/(tabs)/Profil';
import ExploreScreen from '../app/(tabs)/explore';
import AddPostScreen from '../app/(tabs)/AddPostScreen';
import AntDesign from '@expo/vector-icons/AntDesign';
import Panier from '../app/(tabs)/Profil_infos/Panier';
import MyProducts from '../app/(tabs)/Profil_infos/MyProducts';
import Connections from '../app/(tabs)/Profil_infos/connections';
import Login from '../app/(tabs)/index';
import EditProfile from '../app/(tabs)/Profil_infos/EditProfile';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator initialRouteName='Profil'>
            <ProfileStack.Screen name="Profil" component={ProfileScreen} options={{headerShown: false}} />
            <ProfileStack.Screen name="Panier" component={Panier} />
            <ProfileStack.Screen name="MyProducts" component={MyProducts} />
            <ProfileStack.Screen name="Connections" component={Connections} />
            <ProfileStack.Screen name="Login" component={Login} />
            <ProfileStack.Screen name="EditProfile" component={EditProfile} />
        </ProfileStack.Navigator>
    );
}
const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} tabBarActiveTintColor="#000" initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarLabel: ({color}) => (
                <View>
                <Text style={{color:color,fontSize:12,marginBottom:3}}>Home</Text>
                </View>
            ),
            tabBarIcon: ({color,size}) => (
                <AntDesign name="home" size={size} color={color} />
            )

        }}/>
       
        <Tab.Screen name="explore" component={ExploreScreen} 
        options={{
            tabBarLabel: ({color}) => (
                <View>
                <Text style={{color:color,fontSize:12,marginBottom:3}}>Explore</Text>
                </View>
            ),
            tabBarIcon: ({color,size}) => {
                return <AntDesign name="search1" size={size} color={color} />
            }}
        }
        />
        <Tab.Screen name="AddPost" component={AddPostScreen} 
        options={{
            tabBarLabel:({color}) => (
                <View>
                <Text style={{color:color,fontSize:12,marginBottom:3}}>AddPost</Text>
                </View>
            ),
            tabBarIcon: ({color,size}) => {
                return <AntDesign name="pluscircleo" size={size} color={color} />
        }}
    }
        
        />
     <Tab.Screen name="Profil" component={ProfileStackScreen} 
        options={{
            tabBarLabel: ({color}) => (
                <View>
                <Text style={{color:color,fontSize:12,marginBottom:3}}>Profile</Text>
                </View>
            ),
            tabBarIcon: ({color,size}) => {
                return <AntDesign name="user" size={size} color={color} />
            }
        }}
        />
    </Tab.Navigator>
  )
}