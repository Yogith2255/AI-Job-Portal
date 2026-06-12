import {Navigate} from 'react-router-dom'

const ProtectedRoute = props => {
  const {children} = props

  const token = localStorage.getItem('jwt_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute