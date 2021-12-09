const UserModel = require("../models/user.model");

const addUser =  (user_id, movie) => {
    if(user_id == '')
        throw new Error('user_id cannot be null');
    if(movie == {})
        throw new Error('movie cannot be null');
    
    const user = new UserModel({
        user_id: user_id,
        movies: [movie]
    });

    return user.save();
};

const findUser = (user_id) => {
    return UserModel.findOne({user_id: user_id});
};

// this method is using find function
const addMovieToUser = async (user_id, movie) => {
    user = await findUser(user_id);
    user.movies.push(movie);

    return user.save();
};

async function updateOrCreateUser(user_id, movie) {
    const user = await findUser(user_id);   // using find
  
    if(user != undefined){
      // not calling addMovieToUser so find is not called twice 
      user.movies.push(movie);
      return user.save();
    }
    
    return addUser(user_id, movie);
};

module.exports = {
    addUser,
    addMovieToUser,
    findUser,
    updateOrCreateUser,
};