const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const { User } = require('../../models/user');

const avatarDir = path.join(__dirname, '../../', 'public', 'avatars');

const updateUserAvatar = async (req, res) => {
    const { _id } = req.user
    const { path: tempDir, originalname } = req.file
    const [extention] = originalname.split('.').reverse()
    const newAvatar = `${_id}.${extention}`
    const uploadDir = path.join(avatarDir, newAvatar)
    await fs.rename(tempDir, uploadDir)
    const avatarURL = path.join('avatars', newAvatar)
    Jimp.read(uploadDir, (err, lenna) => {
    if (err) throw err;
    lenna
        .resize(250, 250)
        .write(uploadDir)
    })
    await User.findByIdAndUpdate(req.user._id, { avatarURL })
    res.json({ avatarURL })
};

module.exports = updateUserAvatar;