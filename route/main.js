const express = require("express");
const route = express.Router();
const user = require("../route/models/user");
const record=require("../route/models/record")
const bcrypt = require("bcryptjs");

route.get("/", (req, res) => {
  const emmision=req.query.emmision
  res.render("home",{"emmision":emmision});
});

route.get("/login", (req, res) => {
  res.render("login", { error: null });
});

route.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const name = await user.findOne({ username });
  if (!name) {
    return res.render("login", { error: "Username not found!" });
  }

  const pass = await bcrypt.compare(password, name.password);
  if (!pass) {
    return res.render("login", { error: "Incorrect password!" });
  }

  req.session.user = {
    id:name._id,
    username: name.username
  };

  res.redirect("/");
});

route.get("/register", (req, res) => {
  res.render("register", { error: null });
});

route.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  const exists = await user.findOne({ username });
  if (exists) {
    return res.render("register", { error: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await new user({
    username,
    password: hashedPassword,
    email
  }).save();

  res.redirect("/");
});

route.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
route.post("/home", isAuthenticated, async (req, res) => {
  console.log("Session user:", req.session.user); // debug

  const { date, waste, travel, electricity, gas_litre } = req.body;

  const totalEmission =
    Number(travel) * 0.21 +
    Number(electricity) * 0.85 +
    Number(gas_litre) * 2.3 +
    Number(waste) * 0.5;

  await new record({
    username: req.session.user.id,
    date,
    travel,
    electricity,
    gas_litre,
    waste,
    totalEmission
  }).save();

  res.redirect(`/?emmision=${totalEmission}`);
});

function isAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.id) {
    return next();
  }
  return res.redirect("/login");
}


route.get("/dashboard",isAuthenticated,async(req,res)=>{
  const records= await record.find( {username: req.session.user.id}).sort({date:-1})
  res.render("dashboard",{records})
})

route.post("/delete/:id",async(req,res)=>{
  await record.findByIdAndDelete(req.params.id)
  res.redirect("/dashboard")
})

route.get("/editpost/:id",async(req,res)=>{
  const data= await record.findById(req.params.id)
  res.render("edit",{data,layout: "layouts/main"})
})

route.post("/editpost/:id",async(req,res)=>{
  const { date, waste, travel, electricity, gas_litre } = req.body;
  const totalEmission =
    Number(travel) * 0.21 +
    Number(electricity) * 0.85 +
    Number(gas_litre) * 2.3 +
    Number(waste) * 0.5;

  await record.findByIdAndUpdate(req.params.id,{ date, waste, travel, electricity, 
    gas_litre,totalEmission})
  res.redirect("/dashboard")
})

module.exports = route;
