const users = [];

const findUserByEmail = (email) => {
    return users.find((user) => user.email === email);
};

const findUserById = (id) => {
    return users.find((user) => user.id === id);
};

const createUser = (user) => {
    users.push(user);
    return user;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};