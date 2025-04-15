import { useLocation } from "react-router-dom";
import Router from "./routes/routes.js";

function App() {
  const location = useLocation();
  // const isLoginPage = location.pathname === '/login';

  return <Router />;
}

export default App;
