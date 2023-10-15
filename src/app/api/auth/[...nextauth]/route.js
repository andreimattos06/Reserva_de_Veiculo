import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { signOut } from "next-auth/react"

export const authOptions = {
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token) {
        session.user.nome_completo = token.nome_completo
        session.user.administrador = token.administrador
        session.user.empresa = token.empresa
        session.user.token = token.token
        session.user.refresh_token = token.refresh_token
        session.user.token_expiresin = token.expiresin
      }


      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.nome_completo = user.nome_completo
        token.administrador = user.administrador
        token.empresa = user.empresa
        token.token = user.token
        token.refresh_token = user.refresh_token
        token.expiresin = Math.round(Date.now() + 800000)

        return token
      }
      else if (Date.now() < token?.expiresin) {
        return token
      }
      else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/refreshtoken"}`, {
          method: 'POST',
          body: JSON.stringify({}),
          headers: { "Content-Type": "application/json", "refreshtoken": token.refresh_token }
        })
        const user = await res.json();

        if (user == "Expired") {
          signOut()
        }
        else {
          token.nome_completo = user.nome_completo
          token.administrador = user.administrador
          token.empresa = user.empresa
          token.token = user.token
          token.refresh_token = user.refresh_token
          token.expiresin = Math.round(Date.now() + 800000)

          return token
        }

      }


    }
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
  },
  jwt: {
    maxAge: 15 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/login"}`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }