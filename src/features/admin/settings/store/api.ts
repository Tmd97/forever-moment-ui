export const fetchSettingsData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Settings Data' });
        }, 1000);
    });
};
