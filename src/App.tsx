import './App.css'
import AppRoutes from "./routes/AppRoutes.tsx";
import React, {useEffect, useState} from "react";
import {loadingEvent} from "./utils/LoadingEvent.ts";
import LoadingModal from "./components/LoadingModal.tsx";

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadingEvent.onTrigger((show) => {
            setIsLoading(show);
        });
    }, []);

    return (
        <div className="max-w-md sm:max-w-xl mx-auto sm:scrollbar-none md:scrollbar-thumb-blue-haze-400 scroll-smooth">
            {isLoading && <LoadingModal title="Chargement..." />}
            <div inert={isLoading}>
                <AppRoutes />
            </div>
        </div>
    );
};

export default App;
