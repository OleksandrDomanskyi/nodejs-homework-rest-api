const { User } = require('../../models/user');
const { createError } = require("../../helpers");

const updateSubscriptionById = async (req, res) => {
    const { _id } = req.user
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true })
    res.json('Subscription updated')
    if (!result) {
        throw createError(404, "Not found")
    }
    res.json(result)
};

module.exports = updateSubscriptionById;