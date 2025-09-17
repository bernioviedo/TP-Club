import { genSalt, hash as _hash, compare } from 'bcrypt';

const hashPassword = (password) => { 
    return new Promise((resolve, reject) => {
        genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }
            _hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

const comparePassword = (password, hashed) => {
    return compare(password, hashed);
};

export  { 
    hashPassword,
    comparePassword,
}