const mongoose = require("mongoose");





const blogsSchema = new mongoose.Schema({



     title: { type : String,
                require : true },
                
    body: { type : String,
        require : true },
        
 authorId: { type : mongoose.Schema.Types.ObjectId ,
             ref : 'Author',
             require : true 
     },
 
 
 tags: [String],
 
 category: { type : String,
    require : true },
 
 subcategory: [String], 
 
 
   deletedAt: Date,
 isDeleted: { type : Boolean, 
             default: false },
             
publishedAt: Date,

isPublished: { Boolean, default: false } 
 } ,{ timestamps: true }
)
module.exports = mongoose.model('Blogs', blogsSchema)