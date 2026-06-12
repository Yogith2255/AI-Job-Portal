import './index.css'

const DashboardCard = props => {
  const {title, value} = props

  return (
    <div className="dashboard-card">
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  )
}

export default DashboardCard