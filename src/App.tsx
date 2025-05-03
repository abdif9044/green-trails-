
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Auth from './pages/Auth'
import Discover from './pages/Discover'
import Trail from './pages/Trail'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Social from './pages/Social'
import AlbumDetail from './pages/AlbumDetail'
import CreateAlbum from './pages/CreateAlbum'
import Legal from './pages/Legal'
import AdminTrailImport from './pages/AdminTrailImport'
import AdminImportGuidePage from './pages/AdminImportGuidePage'
import AdminRedirect from './pages/AdminRedirect'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/home" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/update-password" element={<Auth />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/trail/:trailId" element={<Trail />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/social" element={<Social />} />
        <Route path="/album/:albumId" element={<AlbumDetail />} />
        <Route path="/create-album" element={<CreateAlbum />} />
        <Route path="/legal/:contentId" element={<Legal />} />
        <Route path="/admin/trails/import" element={<AdminTrailImport />} />
        <Route path="/admin/trails/import/guide" element={<AdminImportGuidePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
