import { useState } from 'react'
import { Pressable, Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'
import { Link, router } from 'expo-router';
import { selectedGroupAtom } from '../../../atoms';
import { useAtom } from 'jotai';

export default function CreateScreen() {
    const [title, setTitle] = useState<string>('')
    const [bodyText, setBodyText] = useState<string>('')
    const [group, setGroup] = useAtom(selectedGroupAtom)

    const goBack = () => {
        setTitle('')
        setBodyText('')
        setGroup(null)
        router.back()
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}>
            {/* HEADER */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name='close' size={30} color='black' onPress={() => goBack()} />
                <Pressable style={{ marginLeft: 'auto' }}>
                    <Text style={styles.postText}>post</Text>
                </Pressable>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    {/* COMMUNITY SELECTOR */}
                    {/* asChild makes the Link similar to a parasite that attaches to the Pressable below */}
                    <Link href='groupSelector' asChild>
                        <Pressable style={styles.communityContainer}>
                            {group ? (
                                <>
                                    <Image source={{ uri: group.image }} style={{ width: 20, height: 20, borderRadius: 10 }} />
                                    <Text style={{ fontWeight: '600' }}>{group.name}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.rStyles}>r/</Text>
                                    <Text style={{ fontWeight: '600' }}>Select a community</Text>
                                </>
                            )}
                        </Pressable>
                    </Link>

                    {/* INPUTS */}
                    <TextInput
                        placeholder='Title'
                        style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 20 }}
                        value={title}
                        // onChangeText={(text) => setTitle(text)} === This can be simplified into the next line
                        onChangeText={setTitle}
                        multiline
                        scrollEnabled={false}
                    />
                    <TextInput
                        placeholder='Body text (optional)'
                        value={bodyText}
                        onChangeText={setBodyText}
                        multiline
                        scrollEnabled={false}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    postText: {
        color: 'white',
        backgroundColor: '#115BCA',
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 7,
        borderRadius: 10
    },
    rStyles: {
        backgroundColor: 'black',
        color: 'white',
        paddingVertical: 1,
        paddingHorizontal: 5,
        borderRadius: 10,
        fontWeight: 'bold'
    },
    communityContainer: {
        backgroundColor: '#EDEDED',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 20,
        gap: 10,
        alignSelf: 'flex-start',
        marginVertical: 10
    }
})