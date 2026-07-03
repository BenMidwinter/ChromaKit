import { useParams, useOutletContext } from 'react-router-dom'

/** Shared context for nested client sub-routes (notes, documents, letters, etc.). */
export function useClientSession() {
  const { id, clientId: clientIdParam } = useParams()
  const clientId = clientIdParam || id
  const ctx = useOutletContext() || {}
  const client = ctx.client ?? ctx.clients?.find(c => c.id === clientId) ?? null
  const session = ctx.session

  return {
    clientId,
    client,
    session,
    refreshClients: ctx.refreshClients,
  }
}
