const db = require('../models');
const { hash, compare } = require('bcrypt');
const {isStrongPassword} = require('validator')


exports.getUser = async(req, res) => {
   const id = req.id;

   try {
          
           const user = await db.users.findOne({ where:id});

           if(!user) throw new Error();

           res.status(200).send({
             name: user.name,
             email: user.email,
             phoneNumber: user.phoneNumber,

           })
          
   }
   catch(err){
     res.status(404).send({
       message: err.message || 'Something went wrong'
     })
   }

};


exports.resetUserPassword = async (req, res) => {
  
  const id = req.id;
  const { currentPassword, newPassword } = req.body;

   if(!currentPassword || !newPassword) {
      res.status(403).send({
        message: 'Invalid Request'
      })
      return;
   }

   if (!isStrongPassword(newPassword)) {
    res.status(403).send({
      message:
        "Password must be atleast 8 chars and minimum of one lowercase, uppercase, number and symbol",
    });
    return;
  }

   try {
 
    const user = await db.users.findOne({ where:{id}});

     if(!user) throw new Error('Invalid User')

     const isPassword = await compare(currentPassword, user.password);

     if(!isPassword) throw new Error('Password Not Correct'); 

     const hashedPassword = await hash(newPassword, 10);

     const response = await db.users.update({password: hashedPassword},{where: { id} });

     if(response.length === 1){
       res.status(200).send({
         message: 'Password successfully changed'
       })
     }
   } 
   catch(err){
     res.status(404).send({error: err.message})
   } 


}