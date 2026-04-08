import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set default title immediately
document.title = "TransitSense - Smart Transit Management";

createRoot(document.getElementById("root")!).render(<App />);
// Feature pages specific change
