import bcrypt from 'bcrypt';

const hashingPassword = (password) => {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                reject(err);
            } else {
                console.log('Hashed password:', hash);
                resolve(hash);
            }
        });
    });
}

const comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                console.error('Error comparing password:', err);
                reject(err);
            } else {
                console.log('Password match result:', result);
                resolve(result);
            }
        });
    });
}

export default { hashingPassword, comparePassword };