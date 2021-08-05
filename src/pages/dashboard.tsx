import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { Can } from '../components/Can'
import { signOut } from '../context/auth'
import { useAuth } from '../hooks/useAuth'
import { useCan } from '../hooks/useCan'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  const { user } = useAuth()

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.list'],
  })

  useEffect(() => {
    ;(async () => {
      try {
        const response = await api.get('/me')

        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  return (
    <div className="container">
      <h1>Dashboard: {user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
      <button type="button" onClick={signOut}>
        Sair
      </button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/me')

    return {
      props: {},
    }
  }
)
