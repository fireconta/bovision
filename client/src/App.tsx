import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import PinLogin from "./pages/PinLogin";
import Dashboard from "./pages/Dashboard";
import HerdManagement from "./pages/HerdManagement";
import AiAssistant from "./pages/AiAssistant";
import AiWeighing from "./pages/AiWeighing";
import AdminPanel from "./pages/AdminPanel";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/aplicativo"} component={PinLogin} />
      <Route path={"/app"} component={Dashboard} />
      <Route path={"/app/rebanho"} component={HerdManagement} />
      <Route path={"/app/assistente"} component={AiAssistant} />
      <Route path={"/app/pesagem"} component={AiWeighing} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/admin-login"} component={() => <div>Admin Login</div>} />
      <Route path={"/planos"} component={() => <Landing />} />
      <Route path={"/suporte"} component={() => <div>Suporte</div>} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
