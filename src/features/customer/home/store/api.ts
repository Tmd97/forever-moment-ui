export const fetchHomeData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Home Page Data' });
        }, 1000);
    });
};
