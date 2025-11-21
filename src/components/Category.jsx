import "../css/Category.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Category = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("all");

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/category"
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Error get categories", error);
            }
        };

        getCategories();
    }, []);

    // "전체" 카테고리를 포함해서 렌더링할 배열 생성
    const categoriesWithAll = [
        { categoryId: "all", categoryName: "전체" },
        ...categories,
    ];

    const handleCategoryClick = (categoryId) => {
        // 선택된 카테고리 ID 업데이트
        setSelectedCategoryId(categoryId);
        // 부모 컴포넌트로 선택된 categoryId 전달
        // 해당 categoryId를 Home -> Scroll로 전달
        onCategoryChange?.(categoryId);
    };

    return (
        <div className="Category">
            {categoriesWithAll.map((category) => (
                <button
                    className="category-button"
                    key={category.categoryId}
                    onClick={() => handleCategoryClick(category.categoryId)}
                >
                    {category.categoryName}
                </button>
            ))}
        </div>
    );
};

export default Category;
