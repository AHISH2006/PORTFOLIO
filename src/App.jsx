import { useState } from "react";
import { Switch, Route } from "wouter";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/not-found";
import LoadingScreen from "./components/ui/LoadingScreen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <Router />
      )}
    </>
  );
}

export default App;