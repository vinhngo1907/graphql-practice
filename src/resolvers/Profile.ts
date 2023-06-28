import { Context, ProfileParent } from "../types";

export const Profile = {
    user: async (parent: ProfileParent, __: any, { prisma }: Context) => {
        const user = await prisma.profile.findUnique({
            where: {
                id: parent.userId
            }
        });

        return user;
    }
}   