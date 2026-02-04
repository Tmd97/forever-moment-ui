export const fetchCategoryData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Category Data' });
        }, 1000);
    });
};
