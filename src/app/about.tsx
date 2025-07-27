import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function AboutScreen() {
    return (
        <View>
            <Link href='index'>This is the about page</Link>
        </View>
    )
}