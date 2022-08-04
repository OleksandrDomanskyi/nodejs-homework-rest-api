const { Contact } = require('../../models/contact');
const { createError } = require('../../helpers');

const getAll = async (req, res) => {
    const { page = 1, limit = 20, favorite = false } = req.query;
    const { _id: owner } = req.user;
    const total = await Contact.countDocuments({ owner });
    const maxPage = Math.ceil(total / limit);

    const resPage = page > maxPage ? maxPage : page;
    const query = favorite ? { favorite, owner } : { owner };
    if (page < 1 || limit < 1) {
        throw createError(400, 'Invalid page or limit');
    }

    const result = await Contact.find(query, '-createdAt -updatedAt')
        .populate('owner', 'email')
        .limit(limit)
        .skip((resPage - 1) * limit)
    res.json({ contacts: result, total, page: resPage, limit })
};

module.exports = getAll;