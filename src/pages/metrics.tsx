import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import decode from 'jwt-decode'

import { Can } from '../components/Can'
import { signOut } from '../context/auth'
import { useAuth } from '../hooks/useAuth'
import { useCan } from '../hooks/useCan'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  return (
    <div className="container">
      <h1>Metrics: </h1>

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
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator'],
  }
)
