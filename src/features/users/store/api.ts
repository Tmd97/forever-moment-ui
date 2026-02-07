export const fetchUsersData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'User Data' });
        }, 1000);
    });
};
