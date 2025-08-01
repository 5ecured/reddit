import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayoutNav() {
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

    if (!publishableKey) {
        throw new Error(
            'Missing publishable key'
        )
    }

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
                    <Slot />
                </ClerkProvider>
            </SafeAreaProvider>
        </QueryClientProvider>
    )
}