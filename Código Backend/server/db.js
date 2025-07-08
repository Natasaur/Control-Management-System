import mongoose from "mongoose";
export const connectDB = async () =>{
   try {
      await mongoose.connect("mongodb://localhost/PruebaDB")
   } catch (error) {
      console.log(error)
   }
}