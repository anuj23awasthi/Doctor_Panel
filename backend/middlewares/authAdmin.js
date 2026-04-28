import jwt from 'jsonwebtoken'

const authAdmin=(req,res,next)=>{

    try{

        const {atoken}=req.headers

        if(!atoken){
            return res.json({message: "Not Authorized Login Again ",success:false})
        }

        const tokenDecode=jwt.verify(atoken, process.env.JWT_SECRET)

        if(tokenDecode !==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.json({message:"Not Authorized Login Again ",success:false})
        }

        next()

    }catch(err){

        console.log(err)
        res.status(400).json({message: err.message})

    }

}

export default authAdmin;