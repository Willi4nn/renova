import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/layout';
import { ClientsPage } from './pages/ClientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { FinancePage } from './pages/FinancePage';
import { ServicesPage } from './pages/ServicesPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/finance" element={<FinancePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
