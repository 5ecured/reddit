import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, Pressable, Image, ActivityIndicator } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { selectedGroupAtom } from '../../atoms'
import { useSetAtom } from 'jotai'
import { Group } from '../../types'
import { useQuery } from '@tanstack/react-query'
import { fetchGroups } from '../../services/groupService'

const groupSelector = () => {
    const [searchValue, setSearchValue] = useState<string>('')
    const setGroup = useSetAtom(selectedGroupAtom)

    const { data, isLoading, error } = useQuery({
        queryKey: ['groups', { searchValue }],
        queryFn: () => fetchGroups(searchValue),
        staleTime: 10000,
        placeholderData: (previousData) => previousData
    })

    const onGroupSelected = (group: Group) => {
        setGroup(group)
        router.back()
    }

    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error || !data) {
        return <Text>Error fetching groups</Text>
    }

    return (
        <SafeAreaView style={{ marginHorizontal: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name='close' size={30} color='black' onPress={() => router.back()} />
                <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', flex: 1, paddingRight: 30 }}>Post to</Text>
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 5, gap: 5, marginVertical: 10, alignItems: 'center', paddingHorizontal: 5 }}>
                <AntDesign name="search1" size={16} color="gray" />
                <TextInput
                    placeholder='Search for a community'
                    placeholderTextColor='grey'
                    style={{ paddingVertical: 10, flex: 1 }}
                    value={searchValue}
                    onChangeText={setSearchValue}
                />
                {searchValue && (
                    <AntDesign name='closecircle' size={15} color='#E4E4E4' onPress={() => setSearchValue('')} />
                )}
            </View>

            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 25 }}
                        onPress={() => onGroupSelected(item)}
                    >
                        <Image source={{ uri: item.image }} style={{ width: 40, aspectRatio: 1, borderRadius: 20 }} />
                        <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    )
}

export default groupSelector