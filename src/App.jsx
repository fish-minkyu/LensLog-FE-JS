import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Detail from "./pages/Detail";
import OAuth2RedircectHandler from "./components/OAuth2RedirectHandler";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/detail/:photoId" element={<Detail />} />
                <Route
                    path="/oauth2/callback"
                    element={<OAuth2RedircectHandler />}
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
