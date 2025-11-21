import axios from "axios";
import { useState, createContext, useContext, useEffect } from "react";

// Axios 전역 기본 설정, withCredentials true 추가
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // { username, authority }
    const [authLoading, setAuthLoading] = useState(true); // 인증 상태 확인 중 로딩

    // 1. 컴포넌트 마운트 시(새로고침 등), 로그인 상태 및 사용자 정보 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/auth/checkLogin"
                );
                if (response.data && response.data.username) {
                    setIsLoggedIn(true);
                    // checkLogin 응답에 authority가 없으면 로컬 스토리지에서 복원 시도
                    const authority =
                        response.data.authority ||
                        localStorage.getItem("userAuthority") ||
                        null;

                    setUser({
                        username: response.data.username,
                        authority: authority,
                    });

                    // authority가 있다면 로컬 스토리지에 저장
                    if (authority) {
                        localStorage.setItem("userAuthority", authority);
                    }
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                    localStorage.removeItem("userAuthority");
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUser(null);
                localStorage.removeItem("userAuthority");
            } finally {
                setAuthLoading(false); // 로딩 완료
            }
        };

        checkLoginStatus();
    }, []);

    // 2. 로그인 API 호출 후 username과 로그인 상태를 설정하는 함수
    const login = (userData) => {
        setIsLoggedIn(true);
        const authority = userData.authority || null;

        setUser({
            username: userData.username,
            authority: authority,
        });

        // authority 정보를 로컬 스토리지에 저장 (새로고침 시 복원용)
        if (authority) {
            localStorage.setItem("userAuthority", authority);
        } else {
            localStorage.removeItem("userAuthority");
        }
    };

    // 3. 로그아웃 시 상태 초기화
    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("userAuthority");
    };

    if (authLoading) {
        return <div>인증 정보 확인 중...</div>; // 초기 로딩 중 UI
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, user, authLoading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth는 AuthProvider 내부에서만 사용 가능합니다.");
    }

    return context;
};
