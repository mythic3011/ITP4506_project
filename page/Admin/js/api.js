export async function fetchUsers() {
    try {
        const response = await fetch('./resources/json/user.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading user data:', error);
        throw new Error('Error loading user data. Please try again later.');
    }
}