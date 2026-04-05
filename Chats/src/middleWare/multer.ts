
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import  {CloudinaryStorage} from "multer-storage-cloudinary"

const Storage= new CloudinaryStorage({
 cloudinary:cloudinary,
    params:{
        folder:"chat-images",
        allowed_formats:["jpg","jpeg","png","gif","webp"],
        transformation:[{width:800,height:600,crop:"limit"},
            {quality:"auto"}
        ],
        
    } as any,
})

export const cloudUpload=multer({
    storage:Storage,
    limits:{
        fileSize: 5*1024*1024,
    },
    fileFilter(req,file,callback){
        // console.log(file.mimetype)
         if(file.mimetype.startsWith("image/")){
            callback(null,true)
        }
        else{
            callback(new Error("only image allowed"))
        }
    }
});