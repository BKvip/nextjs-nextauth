import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LineProvider from "next-auth/providers/line";
 
export const authOptions = {
  // Configure one or more authentication providers
  secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
  // pages: {
  //   signIn: '/auth/signin',
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for check email message)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch("https://www.melivecode.com/api/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
          //  console.log(data) ;
        // If no error and we have user data, return it
        if (data.status == "ok") {
          return data.user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }), 
    GoogleProvider({
      clientId: process.env.googleId ? process.env.googleId : '' ,
      clientSecret: process.env.googleSecret ? process.env.googleSecret : '' 
    }),
    FacebookProvider({
      clientId:  process.env.facebookId ? process.env.facebookId : ''  ,
      clientSecret: process.env.facebookSecret ? process.env.facebookSecret : '' 
    }),
    LineProvider({
      clientId: process.env.lineId ? process.env.lineId : '' ,
      clientSecret: process.env.lineSecret ? process.env.lineSecret : '' 
    }),
  ], 
  callbacks: { 
  
    async jwt({ token, account, user }: any) { 
      // Persist the OAuth access_token and or the user id to the token right after signin 
      if (account) { 
        token.accessToken = account.access_token;
        token.user = user;  
        // console.log(account.provider) ; 
        if (account.provider === "google") {
          token.user.avatar = user.image ; 
        }
        if (account.provider === "facebook") {
          token.user.avatar = user.image ; 
        }
        if (account.provider === "line") {
          token.user.avatar = user.image ; 
        }
      }
      return token;
    },
    async session({ session, token }: any) { 
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user;

      return session;
    },
    // async redirect({ url, baseUrl }:any) {
    //   baseUrl = "http://localhost:3000/profile"; 
    //   return baseUrl
    // },

  },
};

export default NextAuth(authOptions);
