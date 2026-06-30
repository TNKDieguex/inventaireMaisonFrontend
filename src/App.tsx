import './App.css'
import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
  return (
    <div className="max-w-md sm:max-w-xl mx-auto sm:scrollbar-none md:scrollbar-thumb-blue-haze-400 scroll-smooth">
        <AppRoutes/>
    </div>
  )
}

export default App;
