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
import WeighingHistory from "./pages/WeighingHistory";
import VaccinationCalendar from "./pages/VaccinationCalendar";
import FinancialControl from "./pages/FinancialControl";
import Analytics from "./pages/Analytics";
import Health from "./pages/Health";
import AIInsights from "./pages/AIInsights";
import Pasture from "./pages/Pasture";
import Nutrition from "./pages/Nutrition";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import PlansPayment from "./pages/PlansPayment";
import AppHome from "./pages/AppHome";
import App from "./pages/App";
import { useAuth } from "./_core/hooks/useAuth";
import NotificationContainer from "./components/NotificationContainer";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/aplicativo"} component={PinLogin} />
      <Route path={"/app"} component={() => <App><AppHome /></App>} />
      <Route path={"/app/rebanho"} component={() => <App><HerdManagement /></App>} />
      <Route path={"/app/assistente"} component={() => <App><AiAssistant /></App>} />
      <Route path={"/app/pesagem"} component={() => <App><AiWeighing /></App>} />
      <Route path={"/app/pesagem-historico"} component={() => <App><WeighingHistory /></App>} />
      <Route path={"/app/vacinacao"} component={() => <App><VaccinationCalendar /></App>} />
      <Route path={"/app/financeiro"} component={() => <App><FinancialControl /></App>} />
      <Route path={"/app/analytics"} component={() => <App><Analytics /></App>} />
      <Route path={"/app/health"} component={() => <App><Health /></App>} />
      <Route path={"/app/ai-insights"} component={() => <App><AIInsights /></App>} />
      <Route path={"/app/pasture"} component={() => <App><Pasture /></App>} />
      <Route path={"/app/nutrition"} component={() => <App><Nutrition /></App>} />
      <Route path={"/app/alerts"} component={() => <App><Alerts /></App>} />
      <Route path={"/app/reports"} component={() => <App><Reports /></App>} />
      <Route path={"/app/settings"} component={() => <App><Settings /></App>} />
      <Route path={"/app/planos"} component={() => <App><PlansPayment /></App>} />
      <Route path={"admin"} component={AdminPanel} />
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

function AppWrapper() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <NotificationContainer />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default AppWrapper;
