import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
    throw new Error(
        'Missing publishable key'
    )
}

export default function RootLayoutNav() {
    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <Slot />
        </ClerkProvider>
    )
}