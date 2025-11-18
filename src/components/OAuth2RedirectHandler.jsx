import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 소셜 로그인 성공 후 리다이렉트될 때 로드된다.
// 리다이렉트 시, 리다이렉트 응답 바디 데이터를 가져올 수 없으므로 해당 컴포넌트를 만들었다.
const OAuth2RedircectHandler = () => {
    const nav = useNavigate();
    const { isLoggedIn, username, authLoading } = useAuth();

    useEffect(() => {
        // AuthContext의 useEffect에서 이미 로그인 상태를 확인하고
        // username을 가져오는 로직이 수행됩니다.
        // 여기서는 그 과정이 완료될 때까지 기다리거나, 바로 홈으로 보냅니다.

        // 로그인 상태가 확인되면 홈으로 이동
        // 주의: isLoggedIn, username은 AuthContext의 checkLoginStatus()가 완료된 후에 업데이트됩니다.
        // 따라서 이곳에서는 바로 리디렉션하기보다는, AuthContext의 초기 로딩 상태를 확인하는 것이 좋습니다.
        // 하지만 현재 AuthContext는 authLoading이 완료되면 자식들을 렌더링하므로,
        // 이곳에 도달했을 때는 이미 AuthContext의 상태가 최신화되었다고 가정할 수 있습니다.

        // 안전하게 확인 후 리다이렉트
        // AuthContext의 authLoading 상태도 여기에 전달하여 활용하는 것이 더 견고할 수 있습니다.

        if (!authLoading && isLoggedIn) {
            nav("/");
        } else if (!authLoading && !isLoggedIn) {
            nav("/login");
        } // 만약 로그인 실패라면

        // 가장 간단한 방법 (authContext의 checkLoginStatus에 의존)
        nav("/", { replace: true });
    }, [nav, isLoggedIn, username]);

    return <></>;
};

export default OAuth2RedircectHandler;

/*
사용자가 소셜 로그인에 성공하면, 
백엔드의 OAuth2SuccessHandler는 브라우저를 http://localhost:5173/oauth2/callback 주소로 리다이렉트한다.
브라우저가 http://localhost:5173/oauth2/callback URL로 이동하면,
React 애플리케이션은 해당 라우트에 매칭되는 OAuth2RedirectHandler 컴포넌트를 렌더링한다.

이때, App.js의 AuthProvider 컴포넌트가 애플리케이션의 루트에 위치해있으므로, 이 새로운 페이지 로딩 과정에서
AuthProvider 컴포넌트가 다시 마운트되거나, AuthProvider 내부에 있는 useEffect가 다시 실행될 수 있는 조건이 된다.

AuthContext의 useEffect 훅은 빈 의존성 배열을 가지고 있기 때문에,
AuthProvider가 처음 마운트될 때(즉, 페이지가 새로 로드 or 라우팅이 크게 변경될 때) 단 한 번 checkLoginStatus() 함수를 실행한다.

AuthContext는 /api/auth/checkLogin 응답을 받아 isLoggedIn과 username 상태를 업데이트한다.
OAuth2RedirectHandler 컴포넌트는 useAuth()를 통해 isLoggedIn과 username이 업데이트되는 것을 감지하면, 
useEffect 내의 nav("/", { replace: true }); 코드를 실행하여 사용자를 홈 페이지(/)로 리다이렉트하는 것이다.
*/
