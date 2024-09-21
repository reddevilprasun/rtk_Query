import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  liked?: boolean;
}

type PostsResponse = Post[];

export const postApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query<PostsResponse, void>({
      query: () => "posts",
      // Provide the tags that should be invalidated when this endpoint is used
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Posts", id } as const)),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
      transformResponse: (response: PostsResponse) => {
        return response.reverse();
      }
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: "posts",
        method: "POST",
        body,
      }),
      // Invalidates all Posts tags when a new Post is added
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
      //Optimistic Updates
      onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draft) => {
            draft.unshift({
              id: Date.now(),
              title: body.title || "",
              body: body.body || "",
              userId: body.userId || 0,
            });
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
    getPost: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    upDatePost: builder.mutation<Post, Pick<Post, "id"> & Partial<Post>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `posts/${id}`,
          method: "PATCH",
          body,
        };
      },
      // Invalidates the Posts tag for the updated Post
      invalidatesTags: (result, error, { id }) => [{ type: "Posts", id }],
      //Optimistic Updates
      onQueryStarted({ id, ...body }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPost", id, (draft) => {
            Object.assign(draft, body);
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
    upDataLike: builder.mutation<Post, Pick<Post, "id"> & { liked: boolean }>({
      query(data) {
        const { id, liked } = data;
        return {
          url: `posts/${id}`,
          method: "PATCH",
          body: { liked },
        };
      },
      // Invalidates the Posts tag for the updated Post
      invalidatesTags: (result, error, { id }) => [{ type: "Posts", id }],
      //Optimistic Updates
      onQueryStarted({ id, liked }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.find((post) => post.id === id);
            if (post) {
              post.liked = liked;
            }
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      // Invalidates the Posts tag for the deleted Post
      invalidatesTags: (result, error, id) => [{ type: "Posts", id }],
      //Optimistic Updates
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData("getPosts", undefined, (draft) => {
            const index = draft.findIndex((post) => post.id === id);
            draft.splice(index, 1);
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useGetPostQuery,
  useUpDatePostMutation,
  useDeletePostMutation,
  useUpDataLikeMutation,
} = postApi;
