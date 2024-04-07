const db = require('../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `
    SELECT 
        * 
    FROM 
        users
    `;
    return db.manyOrNone(sql);
}

User.findById = (id, callback) => {

    const sql = `
    SELECT 
        id,
        email,
        name,
        image,
        phone,
        password,
        session_token
    FROM 
        users
    WHERE
        id = $1`;
    return db.oneOrNone(sql, id).then(user => {callback(null, user);})
}

User.findByEmail = (email) => {
    const sql = `
    SELECT 
	id,
	email,
	name,
	image,
	phone,
	password,
	session_token
FROM 
	users
WHERE 
	email = $1
    `
return db.oneOrNone(sql, email);

}

User.create = (user) => {

    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex'); //encriptar contraseña
    user.password = myPasswordHashed;
    
    const sql = `
    INSERT INTO
        users(
            email, 
            name,
            phone,
            image,
            password,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;
    return db.one(sql, [
            user.email,
            user.name,
            user.phone,
            user.image,
            user.password,
            new Date(),
            new Date()
    ]);
}

User.isPasswordMatched = (candidatePassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(candidatePassword).digest('hex');
    if (myPasswordHashed === hash){
        return true
    }
    return false;
}

module.exports = User;
