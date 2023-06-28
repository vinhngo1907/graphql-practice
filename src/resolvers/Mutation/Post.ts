import { Context, PostCreateArgs, PostPayload, PostPayloadType, PostUpdateArgs } from '../../types';

export const PostResolvers = {
    postCreate: async (_: any, { post }: PostCreateArgs, { prisma, userInfo }: Context): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Please login to create post' }],
                post: null,
            };
        }
        const { title, content } = post;
        if (!title || !content) {
            return {
                userErrors: [{ message: "You must provide a title and content to create new post" }],
                post: null
            }
        }
        try {
            const newPost = await prisma.post.create({
                data: {
                    title, content, authorId: userInfo.userId
                }
            });

            return {
                userErrors: [],
                post: newPost,
            };
        } catch (error) {
            return {
                userErrors: [error],
                post: null
            }
        }
    },
    // postUpdate: async(_:any, {}: post)
}