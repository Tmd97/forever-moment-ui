export const fetchDashboardData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Dashboard Data' });
        }, 1000);
    });
};
