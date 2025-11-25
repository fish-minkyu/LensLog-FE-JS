import "../css/Upload.css";
import axios from "axios";
import API_ENDPOINTS from "../constants/api.js";
import Header from "../components/Header";
import uploadPhotoIcon from "../assets/upload-photo.svg";
import { useEffect, useState } from "react";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [deleteCategory, setDeleteCategory] = useState("");

    const [message, setMessage] = useState("");

    // 파일 선택 or 드래그 드롭 처리
    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    useEffect(() => {
        if (!file) {
            return;
        }

        // 미리보기 URL 생성
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // cleanup 함수: 컴포넌트가 언마운트되거나 file이 바뀔 때 메모리 해제
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    // ---------- 이미지 관련 로직 -------------
    // 드래그 앤 드롭 이벤트 핸들러 분리
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation(); // 중요: 부모나 브라우저로 이벤트 전파 방지
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation(); // 중요: 새 창 열기 방지

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    // 이미지 업로드 서버 전송
    const onClickUpload = async () => {
        if (!file) {
            alert("이미지를 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("location", location);
        formData.append("category", category);

        try {
            await axios.post(API_ENDPOINTS.PHOTO.UPLOAD_PHOTO, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFile("");
        } catch (error) {
            console.error("사진 업로드에서 에러 발생: ", error);
        }
    };

    // ---------- 카테고리 관련 로직 -------------
    // 카테고리 생성
    const onCreateCategory = async () => {
        try {
            const response = await axios.post(
                API_ENDPOINTS.CATEGORY.MAKE_CATEGORY,
                { categoryName: newCategory }
            );
            //TODO 카테고리 생성 input 하단에 message 띄우기
            // 그 후, 다른 곳 클릭하면 메시지 사라지기
        } catch (error) {
            console.error("카테고리 생성 오류: ", error);
        }
    };

    // 카테고리 수정
    const onUpdateCategory = async () => {};

    // 카테고리 삭제
    const onDeleteCategory = async () => {};

    return (
        <div className="Upload">
            <Header />
            <div className="upload-body">
                <div className="title-header">
                    <h3>이미지 업로드</h3>
                    <button className="upload-button" onClick={onClickUpload}>
                        게시
                    </button>
                </div>
                <div className="upload-area">
                    <label
                        htmlFor="file-input"
                        className="upload-dropzone"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <img
                                src={previewUrl}
                                alt="업로드 이미지 미리보기"
                                className="upload-preview"
                            />
                        ) : (
                            // 파일이 없으면 안내 문구 보여줌
                            <>
                                <img
                                    src={uploadPhotoIcon}
                                    alt="업로드 아이콘"
                                />
                                <p>파일을 선택하거나 여기로 끌어다 놓으세요.</p>
                                <small>
                                    Lens Log는 20MB 미만의 jpg 파일 또는 mp4
                                    파일을 권장합니다.
                                </small>
                            </>
                        )}
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        accept=".jpg,image/jpeg,.mp4"
                        onChange={onFileChange}
                        style={{ display: "none" }}
                    />
                </div>
                <div className="input-area">
                    <h4 className="title">위치</h4>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                        }}
                        placeholder="위치를 입력하세요."
                    />

                    <h4 className="title">카테고리</h4>
                    {/* 카테고리 리스트 가지고 와서 여기다 넣어주기 */}
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                        }}
                    >
                        <option value="">선택하세요.</option>
                    </select>
                </div>

                <hr />

                <div className="category-management">
                    <div>
                        <h4 className="title">카테고리 생성</h4>
                        <input
                            type="text"
                            placeholder="입력하세요."
                            value={newCategory}
                            onChange={(e) => {
                                setNewCategory(e.target.value);
                            }}
                        />
                        <button onClick={onCreateCategory}>생성</button>
                    </div>
                    <div>
                        <h4 className="title">카테고리 수정</h4>
                        <select
                            value={editCategory}
                            onChange={(e) => {
                                setEditCategory(e.target.value);
                            }}
                        >
                            <option value="">선택하세요.</option>
                        </select>
                        <button onClick={onUpdateCategory}>확인</button>
                    </div>
                    <div>
                        <h4 className="title">카테고리 삭제</h4>
                        <select
                            value={deleteCategory}
                            onChange={(e) => setDeleteCategory(e.target.value)}
                        >
                            <option value="">선택하세요.</option>
                        </select>
                        <button onClick={onDeleteCategory}>확인</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;
