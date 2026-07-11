import { useState } from "react";
import { Switch, Route } from "wouter";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/not-found";
import LoadingScreen from "./components/ui/LoadingScreen";
import CustomCursor from "./components/ui/CustomCursor";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
    <title>AHISH S M | Frontend Developer | Full Stack Developer</title>

    <meta
      name="description"
      content="Portfolio of AHISH S M showcasing Frontend Development, Full Stack Development, React, MERN Stack, AI, and modern web applications."
    />

    <meta
      name="keywords"
      content="AHISH S M, Ahish, Ahish SM, Frontend Developer, React Developer, Full Stack Developer, MERN Stack, JavaScript, HTML5, CSS3"
    />
  </Helmet>
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <>
          <CustomCursor />
          <Router />
        </>
      )}
    </>
  );
}

export default App;