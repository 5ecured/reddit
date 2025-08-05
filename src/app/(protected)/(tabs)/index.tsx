import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import PostListItem from '../../../components/PostListItem';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../../services/postService';
import { useSupabase } from '../../../lib/supabase';


export default function HomeScreen() {
    const supabase = useSupabase()

    const { data: posts, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ['posts'],
        queryFn: () => fetchPosts(supabase),
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
