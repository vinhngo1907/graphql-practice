import { userLoader } from "../loaders/user-loader";
import { Context, ProfileParent } from "../types";

export const Post = {
    user: async (parent: ProfileParent, __: any, { prisma }: Context) => {
        return await userLoader.load(parent.userId);
    }
}