import jwt from 'jsonwebtoken'

const authDoctor=(req,res,next)=>{

    try{

        const {dtoken}=req.headers

        if(!dtoken){
            return res.json({message: "Not Authorized Login Again ",success:false})
        }

        const tokenDecode=jwt.verify(dtoken, process.env.JWT_SECRET)

        // GET requests may not have a body; ensure we can safely attach docId.
        if (!req.body) {
            req.body = {}
        }
        req.body.docId = tokenDecode.id

        next()

    }catch(err){

        console.log(err)
        res.status(400).json({message: err.message})

    }

}

export default authDoctor;