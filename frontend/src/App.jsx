import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import SavedJobs from './pages/SavedJobs'
import AppliedJobs from './pages/AppliedJobs'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import CreateJob from './pages/CreateJob'
import Applicants from './pages/Applicants'
import MyJobs from './pages/MyJobs'
import EditJob from './pages/EditJob'
import Chatbot from './pages/Chatbot'

const App = () => (
  <BrowserRouter>
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/jobs" element={<Jobs />} />

      <Route
        path="/jobs/:id"
        element={<JobDetails />}
      />

      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applied-jobs"
        element={
          <ProtectedRoute>
            <AppliedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-job/:id"
        element={
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-jobs"
        element={
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-job"
        element={
          <ProtectedRoute>
            <CreateJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applicants/:jobId"
        element={
          <ProtectedRoute>
            <Applicants />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
)

export default App