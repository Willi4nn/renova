import './App.css';
import { Layout } from './components/Layout';
import { Button } from './components/ui/Button';

function App() {
  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Bem-vindo!</h1>
        <p className="text-slate-500">Gerencie a estofaria com eficiência.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Teste</h2>
        <Button>Teste</Button>
      </section>
    </Layout>
  );
}

export default App;
