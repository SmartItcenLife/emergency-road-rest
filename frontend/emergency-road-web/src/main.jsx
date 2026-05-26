import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AdminDashboardPage} from './pages/admin/AdminDashboardPage'
import AdminUserListPage from './pages/admin/AdminUserListPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <AdminDashboardPage/>
    <AdminUserListPage/>
  </StrictMode>,
)
