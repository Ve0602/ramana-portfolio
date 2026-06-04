const mongoose=require('mongoose');
const s=new mongoose.Schema({title:{type:String,required:true},subject:{type:String,required:true},body:{type:String,required:true},template:{type:String,default:'general'},templateData:{type:mongoose.Schema.Types.Mixed,default:{}},sentTo:{type:Number,default:0},sentAt:{type:Date,default:null},status:{type:String,enum:['draft','sent','failed'],default:'draft'},autoTriggered:{type:Boolean,default:false},triggerType:{type:String,default:''},createdAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Campaign',s);
