const User = require('../../models/user-model');
const Contact = require('../../models/contact-model');

const getAllUsers = async (req, res) => {
    try {
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 5;
        const skip=(page-1)*limit;
        const totalUsers= await User.countDocuments();

        const sortOrder = req.query.order === "desc" ? -1 : 1;
        const users = await User.find()
            .sort({username:1})
            .select({ password: 0 })
            .skip(skip)
            .limit(limit);
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        const totalPages=Math.ceil(totalUsers/limit);

        return res.status(200).json({
            users,
            currentPage: page,
            totalPages,
            totalUsers
        });
    } catch (error) {
        next(error);
    }
}
const updateStatus= async (req, res) => {
    const {userId,status} = req.body;

    try {
        const user= await User.findByIdAndUpdate(userId,{status},{new:true});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({message: "Status updated successfully",user});
    } catch (error) {
        return res.status(500).json({ message: "Error updating status",error });
    }
}
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" });
        }
        return res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
}

const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        await User.deleteOne({ _id: id })
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findOne({ _id: id }, { password: 0 })
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const updateUserData = req.body;

        const updateData = await User.updateOne({ _id: id }, { $set: updateUserData })
        if (!updateData) {
            return res.status(404).json({ message: "User not found" }); // User not found case
        }

        return res.status(200).json(updateData);
    } catch (error) {
        console.log(error);
    }
}

const deleteContactById = async (req, res) => {
    try {
        const id = req.params.id;
        await Contact.deleteOne({ _id: id })
        return res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        next(error);
    }
}
module.exports = { getAllUsers, getAllContacts, deleteUserById, getUserById, updateUserById, deleteContactById, updateStatus };