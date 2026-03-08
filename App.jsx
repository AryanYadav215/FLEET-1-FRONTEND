import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ManufacturerDashboard from './pages/Manufacturer/ManufacturerDashboard';
import CreateShipment from './pages/Manufacturer/CreateShipment';
import ShipmentList from './pages/Manufacturer/ShipmentList';
import ShipmentDetail from './pages/Manufacturer/ShipmentDetail';
import TransporterDashboard from './pages/Transporter/TransporterDashboard';
import OperationsDashboard from './pages/Operations/OperationsDashboard';
import UserManagement from './pages/Admin/UserManagement';
import TransporterNetwork from './pages/Admin/TransporterNetwork';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Manufacturer Routes */}
          <Route path="/manufacturer" element={<Layout />}>
            <Route path="dashboard" element={<ManufacturerDashboard />} />
            <Route path="create-shipment" element={<CreateShipment />} />
            <Route path="shipments" element={<ShipmentList />} />
            <Route path="shipments/:id" element={<ShipmentDetail />} />
          </Route>

          {/* Transporter Routes */}
          <Route path="/transporter" element={<Layout />}>
            <Route path="dashboard" element={<TransporterDashboard />} />
          </Route>

          {/* Operations Routes */}
          <Route path="/operations" element={<Layout />}>
            <Route path="dashboard" element={<OperationsDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<Layout />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="transporters" element={<TransporterNetwork />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
