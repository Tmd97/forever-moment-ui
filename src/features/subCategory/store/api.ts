export const fetchSubCategoryData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'SubCategory Data' });
        }, 1000);
    });
};
