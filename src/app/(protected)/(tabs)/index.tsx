import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import PostListItem from '../../../components/PostListItem';
// import posts from '../../../../assets/data/posts.json'
import { supabase } from '../../../lib/supabase';
import { useState, useEffect } from 'react';
import { Tables } from '../../../types/database.types';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../../services/postService';


export default function HomeScreen() {
    const { data: posts, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['posts'],
        queryFn: () => fetchPosts(),
        staleTime: 10_000
    })


    if (isLoading) {
        <ActivityIndicator />
    }

    if (error) {
        return <Text>Error fetching posts</Text>
    }

    return (
        <View>
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostListItem post={item} />}
                //the 2 below are for pull down to refresh
                onRefresh={refetch}
                refreshing={isRefetching}
            />
        </View>
    )
}
