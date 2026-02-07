export const fetchExperienceData = async () => {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Experience Data' });
        }, 1000);
    });
};
