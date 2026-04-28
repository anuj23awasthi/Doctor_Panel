import jwt from 'jsonwebtoken'

const authUser = (req, res, next) => {

    try {

        const token = req.headers.token || req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.json({message: "No token provided", success: false})
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = tokenDecode.id

        next()

    } catch (err) {

        console.log(err)
        res.status(400).json({message: err.message})

    }

}

export default authUser;