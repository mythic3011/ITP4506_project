export function validateUser(users, email, password) {
    const user = users.find(u => u.email === email);

    if (!user) {
        throw new Error('Email not found. Please check your email address.');
    }

    if (user.password !== password) {
        throw new Error('Invalid password. Please try again.');
    }

    return user;
}

export function redirectUser(user) {
    if (user.role === 'Admin') {
        return `./page/${user.role}/index.html`;
    } else if (user.role === 'Staff') {
        const path = user.InsuranceLicenseNumber ? 'Insurance/index.html' : 'Sales/index.html';
        return `./page/${user.role}/${path}`;
    } else if (user.role === 'Customer') {
        return `./page/${user.role}/index.html`;
    }
    throw new Error('Invalid user role');
}