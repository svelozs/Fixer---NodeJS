const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {

  async getAll(req, res, next){
    try {
        const data = await User.getAll();
        console.log(`Usuarios: ${data}`);
        return res.status(201).json(data);
    } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(501).json({
            success: false,
            message: 'Error al obtener usuarios'
        });
    }
  },

  async register(req, res, next){
    try {
      
      const user = req.body;
      const data = await User.create(user);

      return res.status(201).json({
        success: true,
        message: 'El registro se realizó correctamente',
        data: data.id
      });

    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error con el registro del usuario',
        error: error
      });
    }
  },

  async login(req, res, next){
    try {
        const email = req.body.email;
        const password = req.body.password;

        const myUser = await User.findByEmail(email);

        if (!myUser){
          return res.status(401).json({
            success:false,
            message: 'El email no fue encontrado'
          })
        }
        if(User.isPasswordMatched(password, myUser.password)){
          const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {
         //   expiresIn: (60*60*24)  //1 HORA
          });
          const data = {
            id: myUser.id,
            name: myUser.name,
            email: myUser.email,
            phone: myUser.phone,
            image: myUser.image,
            session_token: `JWT ${token}`
          }
          return res.status(201).json({
            success: true,
            data: data,
            message: 'Usuario autenticado'
          });
        }
        else{
          return res.status(401).json({
            success: false,
            message: 'La contraseña es incorrecta',
          });
        }

    } 
      catch (error) {
        console.log(`Error: ${error}`);
        return res.status(501).json({
          success: false,
          message: 'Error al momento de hacer login',
          error: error
        })
    }
  }



};