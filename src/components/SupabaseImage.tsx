import { ComponentProps, useEffect, useState } from "react"
import { ActivityIndicator, Image, View } from "react-native"
import { downloadImage } from "../utils/supabaseImages"
import { useSupabase } from "../lib/supabase"

type SupabaseImageProps = {
    bucket: string,
    path: string,
} & ComponentProps<typeof Image>

export const SupabaseImage = ({ path, bucket, ...imageProps }: SupabaseImageProps) => {
    const [image, setImage] = useState<string>()
    const supabase = useSupabase()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const handleDownload = async () => {
        const result = await downloadImage(path, supabase)
        setImage(result)
        setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        if (path && bucket) {
            handleDownload()
        } else {
            setIsLoading(false)
        }
    }, [path, bucket])

    if (isLoading) {
        return (
            <View style={{
                backgroundColor: 'gainsboro',
                alignItems: 'center',
                justifyContent: 'center',
                width: "100%",
                aspectRatio: 4 / 3,
                borderRadius: 15
            }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <Image
            source={{ uri: image }}
            {...imageProps}
        />
    )
}