"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Heart, Trash } from "lucide-react"
import { useUpDataLikeMutation } from "@/redux/api"

interface PostData {
  title: string
  body: string
  userId: number
  id: number
  liked?: boolean
}

interface EnhancedDataCardProps {
  data?: PostData;
  onEdit: (post: PostData) => void
  onDeleted?: (id: number) => void
}

export default function PostCard({ data ,onEdit, onDeleted }: EnhancedDataCardProps) {
  const [likeUpdate] = useUpDataLikeMutation();

  const handleLike = () => {
    if (data?.liked) {
      likeUpdate({ id: data.id, liked: false })
    } else {
      if (data) {
        likeUpdate({ id: data.id, liked: true })
      }
    }
  }

  if (!data) {
    return (
      <Card className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="text-2xl font-bold">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarFallback className="bg-purple-200 text-purple-700">
              {data.userId}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">User {data.userId}</p>
            <p className="text-xs text-gray-500">Post ID: {data.id}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">{data.body}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${data.liked ? 'text-red-500' : 'text-gray-500'}`}
          onClick={handleLike}
        >
          <Heart className="mr-2 h-4 w-4" fill={data.liked ? "currentColor" : "none"} />
          {data.liked? 1 : 0} {data.liked ? 'Like' : 'Likes'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-500"
          onClick={() => onEdit(data)}
        >
          <Edit className="mr-2 size-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          onClick={() => onDeleted && onDeleted(data.id)}
        >
          <Trash className="mr-2 size-4" />
          <span className="text-red-500">Delete</span>
        </Button>
        <span className="text-xs text-gray-500">Posted by User {data.userId}</span>
      </CardFooter>
    </Card>
  )
}