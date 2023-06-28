import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context, SignupArgs } from "../../types";
import { JWT_SIGNATURE } from "../../keys";

export const AuthResolvers = {
    signin: async (_: any, args: SignupArgs, { prisma }: Context) => {
        const isEmail = validator.isEmail(args.credential.email);
        const isPass = validator.isLength(args.credential.password, { min: 6 });
        const isUserName = validator.isLength(args.name, { min: 6, max: 25 });

        if (!isEmail || !isPass || !isUserName) {
            return {
                userErrors: [{ message: 'Invalid input, check again' }],
                token: null
            }
        }

        try {
            const { name, bio, credential: { email, password } } = args;
            const check = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (check) return {
                userErros: [{ message: "This user already exist" }],
                token: null
            };
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    name: name
                }
            });

            await prisma.profile.create({
                data: {
                    bio: bio,
                    userId: newUser.id,
                },
            });
            const token = await jwt.sign({ userId: newUser.id }, JWT_SIGNATURE);
        } catch (error) {
            return {
                userErrors: [error],
                token: null,
            };
        }
    },

    signup: async (_: any, { credential }: SignupArgs, { prisma }: Context) => {
        try {
            const { email, password } = credential;
            const isEmail = validator.isEmail(email);
            if (!isEmail) {
                return {
                    userErrors: [{ message: "Email is incorrect" }],
                    token: null
                }
            }
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return {
                    userErrors: [{ message: "Email or/and password is incorrect" }],
                    token: null
                }
            }

            const validPass = await bcrypt.compare(password, user?.password);
            if (!validPass) {
                return {
                    userErrors: [{ message: "Email or/and password is incorrect" }]
                }
            }
        } catch (error) {
            return {
                userErrors: [error],
                token: null
            }
        }
    }
}