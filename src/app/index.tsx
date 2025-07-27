import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
    return (
        <View>
            <Link href='about'>The entry is from app/index.jsx</Link>
        </View>
    )
}