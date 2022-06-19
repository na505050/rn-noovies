import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, TouchableOpacity } from "react-native";
import { BLACK_COLOR, DARK_GREY, LIGHT_GREY, YELLOW_COLOR } from "../colors";
import Detail from "../screens/Detail";

const ScreenOne = ({ navigation: { navigate } }) => (
    <TouchableOpacity onPress={() => navigate("Two")}>
        <Text>go to two</Text>
    </TouchableOpacity>
);
const ScreenTwo = ({ navigation: { navigate } }) => (
    <TouchableOpacity onPress={() => navigate("Three")}>
        <Text>go to three</Text>
    </TouchableOpacity>
);
const ScreenThree = ({ navigation: { navigate } }) => (
    <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Search" })}>
        <Text>Go to search</Text>
    </TouchableOpacity>
);

const NativeStack = createNativeStackNavigator();

const Stack = () => (
    <NativeStack.Navigator
        screenOptions={{
            headerBackTitleVisible: false,
        }}
    >
        <NativeStack.Screen name="Detail" component={Detail} />
    </NativeStack.Navigator>
);

export default Stack;