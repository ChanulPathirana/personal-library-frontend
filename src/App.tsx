import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import GoogleDrive from './pages/GoogleDrive'
import Library from './pages/Library'
import UploadPdf from './pages/UploadPdf'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/upload" element={<UploadPdf />} />
        <Route path="/google-drive" element={<GoogleDrive />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
