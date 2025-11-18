import "../css/Category.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Category = () => {
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        getCategories();
    }, []);

    // "전체" 카테고리를 포함해서 렌더링할 배열 생성
    const categoriesWithAll = [
        { categoryId: "all", categoryName: "전체" },
        ...categories,
    ];

    return (
        <div className="Category">
            {categoriesWithAll.map((category) => (
                <button className="category-button" key={category.categoryId}>
                    {category.categoryName}
                </button>
            ))}
        </div>
    );
};

export default Category;
