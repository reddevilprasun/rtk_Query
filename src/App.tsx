import { Loader2 } from "lucide-react";
import {
  useAddPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpDatePostMutation,
} from "./redux/api";
import PostCard from "./components/PostCard";
import AddPostForm from "./components/AddPost";
import EditPostForm from "./components/EditPostForm";
import { useState } from "react";

interface PostData {
  title: string;
  body: string;
  userId: number;
  id: number;
}

function App() {
  const { isError, isLoading, isSuccess, data, error } = useGetPostsQuery();
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [newPost] = useAddPostMutation();
  const [postDelete] = useDeletePostMutation();
  const [updatePost] = useUpDatePostMutation();

  const handleEditPost = (post: PostData) => {
    setEditingPost(post);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const onAddPost = (post: PostData) => {
    newPost(post);
  };

  const onDeleted = (id: number) => {
    postDelete(id);
  };

  const onUpdate = (post: PostData) => {
    updatePost(post)
      .unwrap()
      .then((fulfilled) => console.log(fulfilled))
      .catch((rejected) => console.log(rejected))
      .finally(() => setEditingPost(null));
  };
  return (
    <div className="m-4">
      <div>
        <div className=" text-2xl text-blue-600 text-center font-bold">
          Redux Toolkit Query Example
        </div>
      </div>
      <h2 className=" text-xl text-green-500 font-semibold m-4">Posts</h2>
      <div className="p-4 flex w-full gap-8">
        {isLoading && (
          <div className=" w-full min-h-screen flex items-center justify-center">
            <div className=" text-blue-500 text-xl font-semibold">Loading </div>
            <Loader2 className=" size-8 ml-4 animate-spin" />
          </div>
        )}
        {isError && (
          <div className=" text-red-500">
            {error instanceof Error ? error.message : JSON.stringify(error)}
          </div>
        )}
        <div className=" flex flex-col items-center w-[50%]">
          <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
          <AddPostForm onAddPost={onAddPost} />
        </div>
        <div className=" flex flex-col i w-full">
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <div className=" overflow-y-scroll max-h-screen grid gap-8 md:grid-cols-2">
            {isSuccess && (
              <>
                {data?.map((post) => (
                  <div key={post.id} className="mb-6">
                    {editingPost && editingPost.id === post.id ? (
                      <EditPostForm
                        post={editingPost}
                        onSave={onUpdate}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <PostCard
                        data={post}
                        onEdit={handleEditPost}
                        onDeleted={onDeleted}
                      />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
