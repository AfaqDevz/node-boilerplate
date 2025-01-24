// import jwt from 'jsonwebtoken';
// import sendRes from "../helper/sendRes";
// import 'dotenv/config'
// import User from '../models/user';


// async function authValid(req, res, next) {
//     console.log('baerer', req?.headers?.authorization);

//     const baerer = req?.headers?.authorization;
//     if (!baerer) return sendRes(res, 403, null, true, 'Token not found!')

//     const token = baerer.split('')[1];

//     const decoded = jwt.verify(token, process.env.AUTH_SECRET);
//     if (decoded) {
//         const user = await User.findById(decoded._id)
//         if (user) {
//             req.user = user
//             next()
//         }
//         else {
//             return sendRes(res, 403, null, true, 'User not found');
//         }
//     } else {
//         return sendRes(res, 403, null, true, 'Invalid Token');
//     }
// }

// export default authValid;