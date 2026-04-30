import React from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {CssBaseline, ThemeProvider} from '@mui/material'
import theme from './theme'
import {useAppStore} from './store/appStore'
import {AppShell} from './components/layout/AppShell'
import {LoginPage} from './pages/LoginPage'
import {NetworkMapPage} from './pages/NetworkMapPage'
import {RouteEditorPage} from './pages/RouteEditorPage'
import {DispatchCommandPage} from './pages/DispatchCommandPage'
import {SimulationPage} from './pages/SimulationPage'
import {SettingsPage} from './pages/SettingsPage'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace/>
  return <>{children}</>
}

const App: React.FC = () => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <BrowserRouter>
        <Routes>
          <Route path="/login"
                 element={isAuthenticated ? <Navigate to="/" replace/> : <LoginPage/>}/>
          <Route
            element={
              <ProtectedRoute>
                <AppShell/>
              </ProtectedRoute>
            }
          >
            <Route index element={<NetworkMapPage/>}/>
            <Route path="/editor" element={<RouteEditorPage/>}/>
            <Route path="/dispatch" element={<DispatchCommandPage/>}/>
            <Route path="/simulation" element={<SimulationPage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
