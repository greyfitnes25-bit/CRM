import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales requeridas");
        }

        // Find user across all companies (first match)
        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        const user = await prisma.user.findFirst({
          where: {
            email,
            isActive: true,
          },
          include: {
            company: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Usuario o contraseña incorrectos");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Usuario o contraseña incorrectos");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: user.company.name,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.companyId = (user as any).companyId;
        token.companyName = (user as any).companyName;
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).companyId = token.companyId;
        (session.user as any).companyName = token.companyName;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
