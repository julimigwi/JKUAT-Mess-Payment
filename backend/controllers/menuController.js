// const getMenuItems = async (req, res) => {
//     try {
//         const menu = [
//             { id: 1, name: 'Rice & Beef', price: 200 },
//             { id: 2, name: 'Ugali & Fish', price: 180 }
//         ];
//         res.json(menu);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };
// module.exports = { getMenuItems };
const Menu = require('../models/Menu');

const getMenuItems = async (req, res) => {
    try {
        const menu = await Menu.find();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMenuItems };
