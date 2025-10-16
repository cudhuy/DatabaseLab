/*
const { User } = require("../models");
const DailyCustomer =require("../models/dailyCustomer.model");

const check={
    checkCustomer: (req,res,next)=>
    {
        const customer =DailyCustomer.find({email: req.body.email});
        if(!customer)
            DailyCustomer.create({
                name:req.body.name,
                email:req.body.email

            });
    }

};
*/
