import {Component} from 'react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import DashboardCard from '../../components/DashboardCard'

import {apiRequest} from '../../services/api'

import './index.css'

class Dashboard extends Component {
  state = {
    stats: null,
  }

  componentDidMount() {
    this.getDashboardStats()
  }

  getDashboardStats = async () => {
    const data = await apiRequest(
      '/dashboard/stats',
    )

    this.setState({
      stats: data,
    })
  }

  render() {
    const {stats} = this.state

    if (!stats) {
      return <h1>Loading...</h1>
    }

    const chartData = [
      {
        name: 'Total Jobs',
        value: stats.totalJobs,
      },
      {
        name: 'Active Jobs',
        value: stats.activeJobs,
      },
      {
        name: 'Applications',
        value: stats.totalApplications,
      },
    ]

    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>
            Recruiter Dashboard 📊
          </h1>

          <p>
            Monitor your jobs,
            applications, and
            recruitment activity.
          </p>
        </div>

        <div className="dashboard-cards">
          <DashboardCard
            title="Total Jobs"
            value={stats.totalJobs}
          />

          <DashboardCard
            title="Active Jobs"
            value={stats.activeJobs}
          />

          <DashboardCard
            title="Applications"
            value={
              stats.totalApplications
            }
          />

          <DashboardCard
            title="Avg Applications"
            value={
              stats.totalJobs > 0
                ? (
                    stats.totalApplications /
                    stats.totalJobs
                  ).toFixed(1)
                : 0
            }
          />
        </div>

        <div className="chart-card">
          <h2>
            Recruitment Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={chartData}
            >
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}

export default Dashboard