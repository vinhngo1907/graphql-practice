import { Context, ProfileParent } from "../types";

export const User = {
    posts: async(parent: ProfileParent, __:any, {Prisma, userInfo}: Context)
}