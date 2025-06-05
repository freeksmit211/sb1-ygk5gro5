import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Management from './pages/Management';
import ManagementNew from './pages/ManagementNew';
import ManagementPortal from './pages/ManagementPortal';
import SalesAccounts from './pages/SalesAccounts';
import SalesOverview from './pages/SalesOverview';
import Sales from './pages/Sales';
import Projects from './pages/Projects';
import LightInspection from './pages/LightInspection';
import EarthLeakage from './pages/EarthLeakage';
import AirconInspection from './pages/AirconInspection';
import PPEInspection from './pages/PPEInspection';
import PPERegister from './pages/PPERegister';
import PPEOrder from './pages/PPEOrder';
import Deliveries from './pages/Deliveries';
import Meetings from './pages/Meetings';
import Vehicles from './pages/Vehicles';
import OutstandingInvoices from './pages/OutstandingInvoices';
import OutstandingOrders from './pages/OutstandingOrders';
import Notices from './pages/Notices';
import Admin from './pages/Admin';
import Stock from './pages/Stock';
import SHEQ from './pages/SHEQ';
import CompanyDetails from './pages/CompanyDetails';
import WhatsApp from './pages/WhatsApp';
import FrancoYearToDate from './pages/FrancoYearToDate';
import FreekYearToDate from './pages/FreekYearToDate';
import JeckieYearToDate from './pages/JeckieYearToDate';
import AccountYearToDate from './pages/AccountYearToDate';
import FrancoFeedbackPage from './pages/FrancoFeedback';
import SalesRepAllocation from './pages/SalesRepAllocation';
import Todo from './pages/Todo';
import Incidents from './pages/Incidents';
import ContractorPacks from './pages/ContractorPacks';
import FuelEntryForm from './pages/FuelEntryForm';
import VehicleInspectionFormPage from './pages/VehicleInspectionFormPage';
import VehicleIncidentFormPage from './pages/VehicleIncidentFormPage';
import Repairs from './pages/Repairs';
import PoolVehicles from './pages/PoolVehicles';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/contacts" element={
          <PrivateRoute>
            <Layout>
              <Contacts />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/management" element={
          <PrivateRoute requiredRoles={['superAdmin', 'management']}>
            <Layout>
              <Management />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/management-new" element={
          <PrivateRoute requiredRoles={['superAdmin', 'management']}>
            <Layout>
              <ManagementNew />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/management/portal" element={
          <PrivateRoute requiredRoles={['superAdmin', 'management']}>
            <Layout>
              <ManagementPortal />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/sales-accounts" element={
          <PrivateRoute>
            <Layout>
              <SalesAccounts />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sales-accounts/ytd" element={
          <PrivateRoute>
            <Layout>
              <Sales />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/sales-accounts/:repId/ytd" element={
          <PrivateRoute>
            <Layout>
              <SalesOverview />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sales-rep-allocation" element={
          <PrivateRoute>
            <Layout>
              <SalesRepAllocation />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sales-accounts/franco/ytd" element={
          <PrivateRoute>
            <Layout>
              <FrancoYearToDate />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sales-accounts/freek/ytd" element={
          <PrivateRoute>
            <Layout>
              <FreekYearToDate />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sales-accounts/jeckie/ytd" element={
          <PrivateRoute>
            <Layout>
              <JeckieYearToDate />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/feedback/franco" element={
          <PrivateRoute>
            <Layout>
              <FrancoFeedbackPage />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sales-accounts/:accountId/ytd" element={
          <PrivateRoute>
            <Layout>
              <AccountYearToDate />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/projects" element={
          <PrivateRoute>
            <Layout>
              <Projects />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/projects/light" element={
          <PrivateRoute>
            <Layout>
              <LightInspection />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/projects/earth" element={
          <PrivateRoute>
            <Layout>
              <EarthLeakage />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/projects/aircon" element={
          <PrivateRoute>
            <Layout>
              <AirconInspection />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/projects/ppe" element={
          <PrivateRoute>
            <Layout>
              <PPEInspection />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/ppe/register" element={
          <PrivateRoute>
            <Layout>
              <PPERegister />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/ppe/order" element={
          <PrivateRoute>
            <Layout>
              <PPEOrder />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/deliveries" element={
          <PrivateRoute>
            <Layout>
              <Deliveries />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/meetings" element={
          <PrivateRoute>
            <Layout>
              <Meetings />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/vehicles/*" element={
          <PrivateRoute>
            <Layout>
              <Vehicles />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/vehicles/pool" element={
          <PrivateRoute>
            <Layout>
              <PoolVehicles />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/invoices" element={
          <PrivateRoute>
            <Layout>
              <OutstandingInvoices />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/orders/outstanding" element={
          <PrivateRoute>
            <Layout>
              <OutstandingOrders />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/notices" element={
          <PrivateRoute>
            <Layout>
              <Notices />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute>
            <Layout>
              <Admin />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/stock" element={
          <PrivateRoute>
            <Layout>
              <Stock />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/sheq" element={
          <PrivateRoute>
            <Layout>
              <SHEQ />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sheq/company/:id" element={
          <PrivateRoute>
            <Layout>
              <CompanyDetails />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sheq/incidents" element={
          <PrivateRoute>
            <Layout>
              <Incidents />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/sheq/contractor-packs" element={
          <PrivateRoute>
            <Layout>
              <ContractorPacks />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/whatsapp" element={
          <PrivateRoute>
            <Layout>
              <WhatsApp />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/todo/:boardId" element={
          <PrivateRoute>
            <Layout>
              <Todo />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/forms/fuel" element={
          <PrivateRoute>
            <Layout>
              <FuelEntryForm />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/forms/vehicle-inspection" element={
          <PrivateRoute>
            <Layout>
              <VehicleInspectionFormPage />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/forms/vehicle-incident" element={
          <PrivateRoute>
            <Layout>
              <VehicleIncidentFormPage />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/repairs" element={
          <PrivateRoute>
            <Layout>
              <Repairs />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;