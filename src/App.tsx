import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProvider, CssBaseline} from '@mui/material';
import theme from './theme';
import {useAppStore} from './store/appStore';
import {AppShell} from './components/layout/AppShell';
import {LoginPage} from './pages/LoginPage';
import {NetworkMapPage} from './pages/NetworkMapPage';
import {RouteAnalyticsPage} from './pages/RouteAnalyticsPage';
import {RouteEditorPage} from './pages/RouteEditorPage';
import {DispatchCommandPage} from './pages/DispatchCommandPage';
import {SimulationPage} from './pages/SimulationPage';
import {FleetStatusPage} from './pages/FleetStatusPage';
import {SettingsPage} from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace/>;
  return <>{children}</>;
};

const App: React.FC = () => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  // Apply dark/light mode class
  React.useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <BrowserRouter>
        <Routes>
          <Route path="/login"
                 element={isAuthenticated ? <Navigate to="/" replace/> : <LoginPage/>}/>{/*TODO: konsolidace login*/}
          <Route
            element={
              <ProtectedRoute>
                <AppShell/>
              </ProtectedRoute>
            }
          >
            <Route index element={<NetworkMapPage/>}/> {/*TODO: consolidace*/}
            <Route path="/analytics" element={<RouteAnalyticsPage/>}/>{/*TODO: konsolidace*/}
            <Route path="/editor" element={<RouteEditorPage/>}/>{/*TODO: konsolidace*/}
            <Route path="/dispatch" element={<DispatchCommandPage/>}/>
            <Route path="/simulation" element={<SimulationPage/>}/>{/*TODO: konsolidace*/}
            <Route path="/fleet" element={<FleetStatusPage/>}/>{/*TODO: konsolidace*/}
            <Route path="/settings" element={<SettingsPage/>}/>{/*TODO: konsolidace*/}
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
