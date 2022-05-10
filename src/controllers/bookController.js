//=================================== imports ==========================================//

const validators = require('../validators/validator');

const bookModel = require('../models/bookModel');

const userModel = require('../models/userModel');

const reviewModel = require('../models/reviewModel');

const moment = require('moment');

//============================ POST /books route handler =========================================//

const createBook = async function (req, res) 
{
    try 
    {
        const data = req.body;

        if (!validators.isValidRequestBody(data)) 
            return res.status(400).send({ status: false, message: 'Invalid request body. Please provide book details.' });
    
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
        
        if (!validators.isValidField(title)) 
        {
            const uniqueTitle = await bookModel.findOne({title});
            
            if (uniqueTitle) 
                return res.status(400).send({ status: false, message: `title : ${title} is already in use` });
            
            else 
                return res.status(400).send({ status: false, message: 'title is required.' });
        }

        //  excerpt is a short piece taken from a book , (like brief summery )

        if (!validators.isValidField(excerpt)) 
            return res.status(400).send({ status: false, message: 'excerpt is required.' });
        
        if (!validators.isValidField(userId)) 
            return res.status(400).send({ status: false, message: 'userId is required.' });

        if (!validators.isValidObjectId(userId)) 
            return res.status(400).send({ status: false, message: 'The given userId is not a valid ObjectId.' });

        const decodedToken = req.validToken;
                
        if ( decodedToken._id != userId) 
            return res.status(403).send({ status: false, message: 'Unauthorised access ! Owner info does not match.' });
        
        if(!validators.isValidField(ISBN))
            return res.status(400).send({status: false, message : 'ISBN is requiured.'});

        if(!validators.isValidISBN(ISBN))
            return res.status(400).send({status: false, message : 'Invalid ISBN. ISBN should be in the format "<3digit prefix code>-<10 digit isbn code>"'});

        if (!validators.isValidField(category)) 
            return res.status(400).send({ status: false, message: 'category is required.' });
        
        if (!validators.isValidField(subcategory)) 
            return res.status(400).send('subcategory is required and must be a string');
            
        if (!validators.isValidField(releasedAt)) 
            return res.status(400).send('releasedAt is required and must be a string.');

        if (!/^[0-9]{4}[-]{1}[0-1]{1}[0-9]{1}[-]{1}[0-9]{2}/.test(releasedAt)) 
            return res.status(400).send({ status: false, message: `releasedAt date format should be YYYY-MM-DD`, });
        
        //validate date

        if (!moment(releasedAt).isValid()) 
            return res.status(400).send({ status: false, message: 'Enter a valid date.' });
        
        if (data.hasOwnProperty("reviews"))
            return res.status(400).send({ status: false, message: 'Invalid field (reviews) in request body.' });
        
        const newBook = await bookModel.create(data);

        return res.status(201).send({ status: true, message: 'Book created succesfully.', data: newBook });
    } 
    catch (error) 
    {
        return res.status(500).send({ status: false, message: error.message });
    }
};

//================================= GET /books route handler ============================================//

const getBooks = async function (req,res)
{
    try
    {
        let filter = {isDeleted : false};

        if(req.query.userId!=undefined)
        {
            if(!validators.isValidObjectId(req.query.userId))
                return res.status(400).send({status : false, message : "Invalid request parameter. userId is invalid."});

            let userExists = await userModel.findById(req.query.userId);
            if(!userExists)
                return res.status(404).send({status : false, message : "UserId does not belong to an existing user."});

            filter['userId']=req.query.userId;
        }

        if(req.query.category!=undefined)      
            filter['category']=req.query.category;
        
        if(req.query.subcategory)
            filter['subcategory']=req.query.subcategory;
        
        let books = await bookModel.find(filter,{ _id : 1,title : 1, excerpt : 1, userId : 1, category : 1, releasedAt : 1, reviews : 1 });

        if(books.length==0)
            return res.status(404).send({status:false,message:"Book(s) not found."});

        return res.status(200).send({ status : true, message : "Success", data : books });
    }
    catch(error)
    {
        return res.status(500).send({status : false, message : error.message});
    }
};

//============================= GET /books/:bookId route handler =========================================//

const getBookById = async function (req, res) 
{
    try 
    {
  
      let bookId = req.params.bookId;
  
      if(!validators.isValidObjectId(bookId))        
        return res.status(400).send({status: false, message: `${bookId} is not a valid book id`});
  
      const bookDetail = await bookModel.findOne({ _id: bookId, isDeleted: false });
      
      if(!bookDetail)
        return res.status(404).send({status:false, message:"book not found"});
  
      const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, rating:1, review: 1, releasedAt: 1 });;
        
      return res.status(200).send({ status: true, message: 'Books list', data: {...bookDetail.toObject(),reviewsData}});
    } 
    catch (error) 
    {
        return res.status(500).send({ status: false, error: error.message });
    }
};

//=============================== PUT /books/:bookId route handler ==========================================//

const updateBookById = async function (req, res) 
{
    try 
    {
      let requestBody = req.body;

      if (!validators.isValidRequestBody(requestBody)) 
        return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide  details to update' }); //change-- erase author
  
      let bookId = req.params.bookId;
  
      if(!validators.isValidObjectId(bookId))
        return res.status(400).send({status: false, message: `${bookId} is not a valid book id`});
  
      let bookIdCheck = await bookModel.findOne({ _id: bookId, isDeleted: false });
  
      if(!bookIdCheck)   
        return res.status(404).send({status:false,message:'book not found'});
  
      if(!(req.validToken._id == bookIdCheck.userId))
        return res.status(400).send({status:false,message:'unauthorized access'});

      if (!bookIdCheck) 
        return res.status(404).send({ status: false, msg: 'book not exist please provie valid book id' });
  
      let uniqueCheck = await bookModel.find({$or: [{ title: requestBody.title }, { ISBN: requestBody.ISBN }]} );
      
      if (uniqueCheck.length > 0) 
        return res.status(400).send({ status: false, msg: 'title or isbn number is not unique' });
    
      let updateObject ={}
  
      if (validators.isValidField(requestBody.title)) 
        updateObject.title =requestBody.title;
      
      if (validators.isValidField(requestBody.excerpt)) 
        updateObject.excerpt =requestBody.excerpt;
  
      if (validators.isValidField(requestBody.ISBN))
        updateObject.ISBN =requestBody.ISBN;
  
      if (validators.isValidField(requestBody.releasedAt)) 
        updateObject.releasedAt =requestBody.releasedAt;
      
      let update = await bookModel.findOneAndUpdate({ _id: bookId },updateObject , { new: true });
  
      return res.status(200).send({ status: true, message: 'sucessfully updated', data: update });
    } 
    catch (error) 
    {
      return res.status(500).send({ status: false, error: error.message });
    }
};

//=================================== DELETE /books/:bookId route handler =========================================//

const deleteBookById = async function (req,res)
{
    try
    {
        if(req.params.bookId===undefined)
            return res.status(400).send({status:false,message : "Invalid request parameter. Please provide bookId."});

        if(!validators.isValidObjectId(req.params.bookId))
            return res.status(400).send({status:false,message : "bookId is not a valid ObjectId."});

        let book = await bookModel.findOne({_id : req.params.bookId,isDeleted : false},{userId : 1});
        if(!book)
            return res.status(404).send({status : false, message : "Book doesn't exist."});

        if ( req.validToken._id != book.userId) 
            return res.status(403).send({ status: false, message: 'unAuthorised access ! owner info doesnot match' });
        
        await bookModel.findOneAndUpdate({_id : req.params.bookId},{isDeleted : true});
        return res.status(200).send({status : true,message : "Book deleted successfully."});
    }
    catch(error)
    {
        return res.status(500).send({status : false,message : error.message});
    }
};

//================================== exports =======================================//

module.exports={createBook,getBooks,getBookById,updateBookById,deleteBookById};