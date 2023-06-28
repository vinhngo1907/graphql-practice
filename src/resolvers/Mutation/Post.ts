import { Context, PostCreateArgs, PostPayload, PostPayloadType, PostUpdateArgs, CanUserMutatePost } from '../../types';
import { canUserMutatePost } from '../../utils/can-user-mutate-post';

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
    postUpdate: async (_: any, { postId, post }: PostUpdateArgs, { prisma, userInfo }: Context): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
                post: null,
            };
        }
        const error = await canUserMutatePost({ postId: +postId, userId: userInfo.userId, prisma });
        if (error) return error;

        const { title, content } = post;
        if (!title && !content) {
            return {
                userErrors: [{ message: "Use must provide a title or content to update post" }],
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({ where: { id: +postId } });
        if (!existingPost)
            return {
                post: null,
                userErrors: [{ message: 'Post does not exist' }],
            };

        try {
            const updatedPost = await prisma.post.update(
                {
                    where: { id: +postId },
                    data: {
                        title, content
                    }
                },

            )
            if (!updatedPost) {
                return {
                    userErrors: [{ message: "Post not found or user not authorized" }],
                    post: null
                }
            }
            return {
                userErrors: [],
                post: updatedPost
            }
        } catch (error) {
            return {
                userErrors: [error],
                post: null
            }
        }
    },
    postDelete: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
                post: null,
            };
        }
        const error = await canUserMutatePost({ postId: +postId, userId: userInfo.userId, prisma });
        if (error) return error;

        const existingPost = await prisma.post.findUnique({ where: { id: +postId } });
        if (!existingPost)
            return {
                post: null,
                userErrors: [{ message: 'Post does not exist' }],
            };
        try {
            await prisma.post.delete({ where: { id: +postId } });
            return {
                post: existingPost,
                userErrors: [],
            };
        } catch (error) {
            return {
                userErrors: [error],
                post: null
            }
        }
    },
    postPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
                post: null,
            };
        }
        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma,
        });
        if (error) return error;
        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId),
                },
                data: {
                    published: true,
                },
            }),
        };
    },
    postUnPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: 'Forbidden access (unauthenticated)' }],
                post: null,
            };
        }
        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma,
        });
        if (error) return error;
        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId),
                },
                data: {
                    published: false,
                },
            }),
        };
    }
}