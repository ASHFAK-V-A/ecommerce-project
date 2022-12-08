module.exports={
    VerifyLoginAdmin:(req,res,next)=>{
        if(req.session.isAdmin){
            next()
        }else{
            res.redirect('/admin/admin-signin')
        }
    },

    VerfyLoginUser:(req,res,next)=>{
        if(req.session.isUser){
            next()
        }else{
           
            res.redirect('/login')
        }
    }

}