const BASE_PROTOCOL = import.meta.env.VITE_PROTOCOL || "http";
const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || "localhost:8080";

const BASE_URL = BASE_PROTOCOL + "://" + BASE_DOMAIN;

const API_ENDPOINTS = {
    AUTH: {
        // 회원가입
        SIGN_UP: `${BASE_URL}/api/auth/join`,
        // 로그인
        LOGIN: `${BASE_URL}/api/auth/login`,
        // 비밀번호 찾기 인증
        VERIFICATION_PWD: `${BASE_URL}/api/auth/verification/password`,
        // 비밀번호 변경
        CHANGE_PWD: `${BASE_URL}/api/auth/change/password`,
        // 사용자 ID 찾기
        FIND_USERNAME: `${BASE_URL}/api/auth/find/username`,
        // 로그아웃
        LOGOUT: `${BASE_URL}/api/auth/logout`,
        // 회원 탈퇴
        DELETE_USER: `${BASE_URL}/api/auth/delete`,
        // 유저 정보 반환
        CHECK_LOGIN: `${BASE_URL}/api/auth/checkLogin`,
    },
    EMAIL: {
        // 인증코드 메일 발송
        SEND_EMAIL: `${BASE_URL}/api/mail/send`,
        // 인증코드 인증
        VERIFICATION_CODE: `${BASE_URL}/api/mail/verify`,
    },
    CATEGORY: {
        // 카테고리 생성
        MAKE_CATEGORY: `${BASE_URL}/api/category`,
        // 카테고리 리스트 조회
        GET_CATEGORY_LIST: `${BASE_URL}/api/category`,
        // 카테고리별 photo 조회
        GET_PHOTO_LIST_GROUP_BY_CATEGORY: `${BASE_URL}/api/category/getList`,
        // 카테고리 수정
        UPDATE_CATEGORY: (categoryId) =>
            `${BASE_URL}/api/category/update/${categoryId}`,
        // 카테고리 삭제
        DELETE_CATEGORY: (categoryId) =>
            `${BASE_URL}/api/category/delete/${categoryId}`,
    },
    PHOTO: {
        // 사진 생성
        UPLOAD_PHOTO: `${BASE_URL}/api/photo/upload`,
        // 사진 목록 조회
        GET_PHOTO_LIST: `${BASE_URL}/api/photo/getList`,
        // 사진 단일 조회
        GET_PHOTO: (photoId) => `${BASE_URL}/api/photo/getOne/${photoId}`,
        // 사진 다운로드
        DOWNLOAD_PHOTO: (photoId) =>
            `${BASE_URL}/api/photo/download/${photoId}`,
        // 사진 삭제
        DELETE_PHOTO: (photoId) => `${BASE_URL}/api/photo/delete/${photoId}`,
    },
    GOOD: {
        // 좋아요 생성 및 삭제
        SAVE_LIKE: (photoId) => `${BASE_URL}/api/good/${photoId}`,
    },
};

export default API_ENDPOINTS;

// 위에서 정의한 API 엔드포인트 파일을 import 합니다.
// import axios from 'axios';
// import API_ENDPOINTS from '../constants/apiEndpoints';

// const response = await axios.post(
//     API_ENDPOINTS.AUTH.LOGIN, // 정의된 엔드포인트 사용
//     { username, password }
//   );

// const response = await axios.get(
//     API_ENDPOINTS.POSTS.GET_POST_BY_ID(postId) // 동적 경로 함수 호출
//   );
