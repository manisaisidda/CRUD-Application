const express=require("express");
const app=express();

const  mongoose=require("mongoose");

const Chat=require("./model/chat.js");

const path=require("path");

const methodOverride=require("method-override");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

let port =8080;

main()
.then(console.log("connection Successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/",(req,res)=>
{
    console.log("root is working");
})

app.get("/chats",async (req,res)=>
{
    let chats=await Chat.find();
    res.render("index.ejs",{chats});

})

app.get("/chats/new",(req,res)=>
{
    res.render("new.ejs");
})


app.get("/chats/:id/edit",async (req,res)=>
{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat});
})


app.post("/chats",(req,res)=>
{
    let {from,msg,to}=req.body;
    let newchat=new Chat(
        {
            from:from,
            msg:msg,
            to:to,
            createat:new Date()
        }
    )
    newchat.save()
    .then((res)=>
    {
        console.log("chat was saved");
    })
    .catch((err)=>
    {
        console.log(err);
    })
    res.redirect("/chats");
})
app.put("/chats/:id",async (req,res)=>
    {
        let {id}=req.params;
        let {msg:newmsg}=req.body;
        let updateChat=await Chat.findByIdAndUpdate(id,{msg:newmsg});
        console.log(updateChat);
        res.redirect("/chats");
    })

    app.delete("/chats/:id",async (req,res)=>
    {
        let{id}=req.params;
        let deletedchat=await Chat.findByIdAndDelete(id);
        console.log(deletedchat);
        res.redirect("/chats");
    })
app.listen(port,()=>
{
    console.log("server started");
})

