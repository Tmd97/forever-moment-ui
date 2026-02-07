export const fetchRolesData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Role Data' });
        }, 1000);
    });
};
