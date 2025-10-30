import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NurseList from "./pages/nursePgae"; // check spelling — maybe nursePage?
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/nurse" replace />} />
        <Route path="/nurse" element={<NurseList />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}

export default App;
