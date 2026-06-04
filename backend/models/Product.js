const mongoose=require('mongoose');
const s=new mongoose.Schema({name:{type:String,required:true},category:{type:String,required:true},description:{type:String,default:''},price:{type:String,default:''},originalPrice:{type:String,default:''},images:[{type:String}],tags:[{type:String}],inStock:{type:Boolean,default:true},featured:{type:Boolean,default:false},colors:[{type:String}],sizes:[{type:String}],isActive:{type:Boolean,default:true},order:{type:Number,default:0},createdAt:{type:Date,default:Date.now},updatedAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Product',s);
