import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add backend user data and JWT token to session
      if (token.backendUser) {
        session.user = {
          ...session.user,
          ...token.backendUser,
        };
      }
      if (token.backendToken) {
        session.backendToken = token.backendToken;
      }
      if (token.backendAuthError) {
        session.backendAuthError = token.backendAuthError;
      }
      session.user.id = token.userId || token.sub || token.id;
      
      return session;
    },
    async jwt({ token, account, profile, user }) {
      // Initial sign in - when account exists, we have the Google token
      if (account?.provider === 'google' && account.id_token) {
        try {
          // Call backend API to verify token and get our JWT
          const response = await fetch(`${apiBase}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: account.id_token,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Backend authentication failed');
          }

          const data = await response.json();

          // Store backend JWT token and user data
          if (data.success && data.token && data.user) {
            token.backendToken = data.token;
            token.backendUser = data.user;
            token.userId = data.user.id;
            token.sub = data.user.id;
          } else {
            token.backendAuthError = 'Backend authentication incomplete';
          }
        } catch (error) {
          // Store error in token so we can check it in session
          token.backendAuthError = error.message || 'Failed to authenticate with backend';
          // Don't throw - allow NextAuth to succeed but frontend can check for backendAuthError
        }
      }

      // Store Google access token if needed
      if (account) {
        token.googleAccessToken = account.access_token;
      }

      // Store NextAuth user ID if available
      if (user) {
        token.id = user.id || token.userId;
        token.sub = user.id || token.userId;
      }

      return token;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key-change-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

