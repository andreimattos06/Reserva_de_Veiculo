import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token != undefined) {
        session.user.nome_completo = token.nome_completo
        session.user.administrador = token.administrador
        session.user.empresa = token.empresa
        session.user.token = token.token
      }


      return session
    },
    async jwt({ token, user }) {
      if (user != undefined) {
        token.nome_completo = user.nome_completo
        token.administrador = user.administrador
        token.empresa = user.empresa
        token.token = user.token
      }
      return token
    }
  },
  session:{
    strategy: "jwt",
    maxAge: 15 * 60,
  },
  jwt:{
    maxAge: 15 * 60,
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
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

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }