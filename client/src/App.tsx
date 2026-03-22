import { Settings } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Processos from "./pages/Processos";
import Prazos from "./pages/Prazos";
import Publicacoes from "./pages/Publicacoes";
import Documentos from "./pages/Documentos";
import Financeiro from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path={"/"} component={Home} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path={"/"} component={Dashboard} />
          <Route path={"/dashboard"} component={Dashboard} />
          <Route path={"/processos"} component={Processos} />
          <Route path={"/prazos"} component={Prazos} />
          <Route path={"/publicacoes"} component={Publicacoes} />
          <Route path={"/documentos"} component={Documentos} />
          <Route path={"/financeiro"} component={Financeiro} />
          <Route path={"/configuracoes"} component={Configuracoes} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
