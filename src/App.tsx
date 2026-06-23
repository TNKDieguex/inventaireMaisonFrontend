import './App.css'
import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
  return (
    <div className="sm:max-w-xl mx-auto
      min-h-dvh
      justify-center
      flex
      flex-col
    ">
        <AppRoutes/>
    </div>
  )
}

export default App;
