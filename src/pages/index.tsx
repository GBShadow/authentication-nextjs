import { GetServerSideProps } from 'next'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { withSSRGuest } from '../utils/withSSRGuest'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useAuth()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = { email, password }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className="container">
      <input
        type="email"
        name="email"
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async (ctx) => {
    return {
      props: {},
    }
  }
)
