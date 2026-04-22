import CreatePost from './pages/CreatePost'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
  return (
    <div className="app-main">
      <Toaster />
      <nav className="nav-bar">
        <div className="logo-container">
          <span className="logo-text">BeatHub</span>
        </div>
      </nav>
      
      <main className="main-content">
        <Dashboard />
        <hr />
        <CreatePost />
      </main>
    </div>
  )
}

export default App

