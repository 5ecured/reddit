import { useState } from 'react'
import { Pressable, Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons'
import { Link, router } from 'expo-router';
import { selectedGroupAtom } from '../../../atoms';
import { useAtom } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../../../lib/supabase';
import { Database, TablesInsert } from '../../../types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker'

type InsertPost = TablesInsert<'posts'>

const insertPost = async (post: InsertPost, supabase: SupabaseClient<Database>) => {
    //use supabase to insert a new post
    const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single()

    if (error) {
        throw error
    } else {
        return data
    }
}

export default function CreateScreen() {
    const [title, setTitle] = useState<string>('')
    const [bodyText, setBodyText] = useState<string>('')
    const [group, setGroup] = useAtom(selectedGroupAtom)
    const [image, setImage] = useState<string | null>(null);

    const queryClient = useQueryClient()
    const supabase = useSupabase()

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            if (!group) {
                throw new Error('Please select a group')
            }

            if (!title) {
                throw new Error('Title is required')
            }

            return insertPost({
                title,
                description: bodyText,
                group_id: group.id,
            }, supabase)
        },
        onSuccess: (data) => {
            //invalidate queries that might have been affected by inserting a post
            //as a result, after creating a post, you will see it in the home screen straight away
            queryClient.invalidateQueries({ queryKey: ['posts'] })

            goBack()
        },
        onError: (error) => {
            Alert.alert('Failed to insert post', error.message)
        }
    })

    const goBack = () => {
        setTitle('')
        setBodyText('')
        setGroup(null)
        router.back()
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}>
            {/* HEADER */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name='close' size={30} color='black' onPress={() => goBack()} />
                <Pressable style={{ marginLeft: 'auto' }} onPress={() => mutate()} disabled={isPending}>
                    <Text style={styles.postText}>{isPending ? 'Posting...' : 'Post'}</Text>
                </Pressable>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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

                    {image && (
                        <View style={{ paddingBottom: 20 }}>
                            <AntDesign
                                name='close'
                                size={25}
                                color='white'
                                onPress={() => setImage(null)}
                                style={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    right: 10,
                                    top: 10,
                                    padding: 5,
                                    backgroundColor: '#00000090',
                                    borderRadius: 20
                                }}
                            />
                            <Image source={{ uri: image }} style={{ width: '100%', aspectRatio: 1 }} />
                        </View>
                    )}

                    <TextInput
                        placeholder='Body text (optional)'
                        value={bodyText}
                        onChangeText={setBodyText}
                        multiline
                        scrollEnabled={false}
                    />
                </ScrollView>
                {/* FOOTER */}
                <View style={{ flexDirection: 'row', gap: 20, padding: 10 }}>
                    <Feather name="link" size={20} color="black" />
                    <Feather name="image" size={20} color="black" onPress={pickImage} />
                    <Feather name="youtube" size={20} color="black" />
                    <Feather name="list" size={20} color="black" />
                </View>
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