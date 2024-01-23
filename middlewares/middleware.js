const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, process.env.key);

    
        const userId = decoded.id;
    
        const userDoc = await admin.firestore().collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(401).send({ message: 'User not found', success: false });
        }
        req.user = userDoc.data();

        next();
    } catch (error) {
        res.status(401).send({ message: 'Auth failed', success: false });
    }
};
