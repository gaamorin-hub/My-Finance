import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import History from "./pages/History";
import Accounts from "./pages/Accounts";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/transactions"} component={Transactions} />
      <Route path={"/budget"} component={Budget} />
      <Route path={"/goals"} component={Goals} />
      <Route path={"/history"} component={History} />
      <Route path={"/accounts"} component={Accounts} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
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
