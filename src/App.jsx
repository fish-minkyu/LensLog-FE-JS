import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FindIdPage from "./pages/FindIdPage";
import ResultFindIdPage from "./pages/ResultFindIdPage";
import FindPasswordPage from "./pages/FindPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResultPasswordChangePage from "./pages/ResultPasswordChangePage";
import ResultRegisterPage from "./pages/ResultRegisterPage";
import Upload from "./pages/Upload";
import OAuth2RedircectHandler from "./components/OAuth2RedirectHandler";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/detail/:photoId" element={<Detail />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/result/register"
                    element={<ResultRegisterPage />}
                />
                <Route path="/find/id" element={<FindIdPage />} />
                <Route path="/result/id" element={<ResultFindIdPage />} />
                <Route path="/find/password" element={<FindPasswordPage />} />
                <Route
                    path="/change/password"
                    element={<ResetPasswordPage />}
                />
                <Route
                    path="/result/password"
                    element={<ResultPasswordChangePage />}
                />
                <Route path="/upload" element={<Upload />} />
                <Route
                    path="/oauth2/callback"
                    element={<OAuth2RedircectHandler />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
