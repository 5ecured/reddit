import React, { useState, useRef, useCallback } from 'react'
import { View, Text, FlatList, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import posts from '../../../../assets/data/posts.json'
import PostListItem from '../../../components/PostListItem'
import comments from '../../../../assets/data/comments.json'
import CommentListItem from '../../../components/CommentListItem'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const DetailedPost = () => {
    //this "id" refers to this file name
    const { id } = useLocalSearchParams()

    const [comment, setComment] = useState<string>('')
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const inputRef = useRef<TextInput | null>(null)

    const insets = useSafeAreaInsets()

    const detailedPost = posts.find(post => post.id === id)

    const postComments = comments.filter(comment => comment.post_id === 'post-1')

    const insetsStyle = {
        paddingBottom: insets.bottom
    }

    // const handleReplyButtonPressed = (commentId: string) => {
    //     inputRef.current?.focus()
    // }

    const handleReplyButtonPressed = useCallback((commentId: string) => {
        inputRef.current?.focus()
    }, [])

    /* 
    memo prevents CommentListItem from rerendering, but ONLY if the props dont change. The handleReplyButtonPressed does 
    change, therefore we use useCallback in order to persist it - so its location in memory does not change. Now, memo works 

    But careful with using memo too much because it uses the memory of your device
    */


    if (!detailedPost) {
        return <Text>Post not found</Text>
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            //Without below, the TextInput will be hidden behind the keyboard. The + 10 is just for some padding
            keyboardVerticalOffset={insets.top + 10}
        >
            <FlatList
                data={postComments}
                renderItem={({ item }) => <CommentListItem comment={item} depth={0} handleReplyButtonPressed={handleReplyButtonPressed} />}
                ListHeaderComponent={<PostListItem post={detailedPost} isDetailedPost />}
            />
            <View style={[styles.a, insetsStyle]}>
                <TextInput
                    placeholder='Join the conversation'
                    style={{ backgroundColor: '#E4E4E4', padding: 5, borderRadius: 15 }}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    ref={inputRef}
                />
                {isInputFocused && (
                    <Pressable style={{ backgroundColor: '#0d469b', borderRadius: 15, marginLeft: 'auto', marginTop: 15 }}>
                        <Text style={{ color: 'white', paddingVertical: 5, paddingHorizontal: 10, fontWeight: 'bold', fontSize: 13 }}>Reply</Text>
                    </Pressable>
                )}
            </View>
        </KeyboardAvoidingView>
    )
}

export default DetailedPost

const styles = StyleSheet.create({
    a: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },

})