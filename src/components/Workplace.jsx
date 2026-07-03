import { useNavigate } from 'react-router-dom'
import WorkplaceDashboard from './workplace/WorkplaceDashboard'

export default function Workplace() {
  const navigate = useNavigate()
  return (
    <WorkplaceDashboard onViewProfile={(client) => navigate(`/clients/${client.id}`)} />
  )
}
