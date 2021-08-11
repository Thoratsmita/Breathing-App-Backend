const User = require("../models/userModel");

const addUser = (User) => ({ name, email, photo }) => {
    const user = new User({
        name, email, photo, source: 'Google'
    })

    return user.save()
}

const getUsers = (User) => () => {
    return User.find({})
}

const getUserByEmail = (User) => async ({email}) => {
    return await User.findOne({ email })
}

const UserService = (User) => {
    return {
        addUser: addUser(User),
        getUsers: getUsers(User),
        getUserByEmail: getUserByEmail(User)
    }
}

module.exports = UserService(User);