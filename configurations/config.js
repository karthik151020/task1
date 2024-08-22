const {Sequelize}=require("sequelize")

const sequelize = new Sequelize('expressproblems', 'root', 'root123', {
    host: 'localhost',
    dialect: 'mysql'
  });

try{
  sequelize.authenticate();
  console.log("Connected")
}
catch(err){
  console.log("Not Connected")
}

module.exports=sequelize;

