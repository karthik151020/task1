const express = require('express')
const sequelize=require("./configurations/config")
const app = express()
const port = 3002

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())

app.get("/users",async(req,res)=>{
    try{
        const users=await sequelize.query("select * from users",{
            type:sequelize.QueryTypes.SELECT
        })
        if(users.length>0){
            return res.status(200).json(users)
        }
        return res.status(204).send("No rows present in the table")
    }
    catch(err){
        return res.status(500).send("Something went wrong")
    } 
})


app.get("/user/:id", async(req,res)=>{
    try{
        const userId=parseInt(req.params.id);
        if(isNaN(userId)){
            return res.status(400).send("id should be integer")
        }
        const user= await sequelize.query("select * from users where id=:id",{
            replacements:{id:userId},
            type:sequelize.QueryTypes.SELECT
        }
        )
        console.log(user);
        if(user.length>0){
            return res.status(200).json(user)
        }
        return res.send("No rows present in the table")
    }
    catch{
        return res.send("something went wrong")
    }
})


app.post("/user/adduser",async(req,res)=>{
   try{
        let {name,age}=req.body;
        if(name==="" || !name){
            return res.send('Enter a valid name')
        }
        const userAge=parseInt(age);
        if(userAge<0 || isNaN(userAge)){
            return res.send("Enter a valid age")
        }
        const user=await sequelize.query("insert into users(name,age) values (:name,:age)",{
            replacements:{name,age:userAge},
            type: sequelize.QueryTypes.INSERT
        })
        console.log(user)
        return res.send("inserted successfully")
   }
   catch(err){
    return res.send("something went wrong")
   }
})


app.put("/update/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).send("Enter a valid user ID");
    }

    const { name, age } = req.body;
    let userAge = age !== undefined ? parseInt(age) : undefined;

    if (age !== undefined && (isNaN(userAge) || userAge < 0)) {
        return res.status(400).send("Enter a valid age");
    }

    if (name !== undefined && (name === '' || typeof name !== 'string')) {
        return res.status(400).send("Enter a valid name");
    }

    const user = await sequelize.query("SELECT * FROM users WHERE id = :id", {
        replacements: { id: userId },
        type: sequelize.QueryTypes.SELECT
    });

    if (user.length === 0) {
        return res.status(404).send("No user found with the given ID");
    }

    let updateQuery = "UPDATE users SET";
    const replacements = { id: userId };

    if (name !== undefined) {
        updateQuery += " name = :name,";
        replacements.name = name;
    }
    if (userAge !== undefined) {
        updateQuery += " age = :age,";
        replacements.age = userAge;
    }
    if (updateQuery.endsWith(",")) {
        updateQuery = updateQuery.substring(0, updateQuery.length-1); 
    } else {
        return res.status(400).send("No valid fields to update");
    }

    updateQuery += " WHERE id = :id";
    await sequelize.query(updateQuery, {
        replacements: replacements,
        type: sequelize.QueryTypes.UPDATE
    });

    res.send("Updated successfully");
});


app.get("/user/:id/orders",async(req,res)=>{
    const userid=parseInt(req.params.id);
    if(isNaN(userid) || userid<0){
        return res.status(400).send("id should be a number")
    }
    const users=await sequelize.query("select * from orders where custid=:custid",{
        replacements:{custid:userid},
        type:sequelize.QueryTypes.SELECT
    })
    if(users.length>0){
        return res.send(users);
    }
    res.send("No users present")
})


app.delete("/user/:id",async(req,res)=>{
    try{
        const userId=parseInt(req.params.id);
        if(isNaN(userId)){
            return res.status(400).send("id should be integer")
        }
        const userPresent=await sequelize.query("select * from users where id=:id",{
            replacements:{id:userId},
            type:sequelize.QueryTypes.SELECT
        })
        if(userPresent.length>0){
            const user=await sequelize.query("delete from users where id=:id",{
                replacements:{id:userId},
                type:sequelize.QueryTypes.DELETE
            })
            console.log(user);
            return res.send("deleted")
        }
        return res.send("no user present")
    }
    catch(err){
        return res.send("something went wrong")
    }

})

app.listen(port);