import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Route, Switch } from "wouter";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Switch>
        <Route path="/admin" component={AdminPage} />
        <Route component={Home} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
