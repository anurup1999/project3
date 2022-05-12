// ================ imports ===========================================================================================//

const mongoose = require('mongoose');

// ================ imports ===========================================================================================//

const isValidField = function (value) 
{
    if (typeof value === 'undefined' || value === null) return false;

    if (typeof value === 'string' && value.trim().length === 0) return false;

    return true;
};

// ================ imports ===========================================================================================//

const isValidRequestBody = function (requestBody) 
{
   return Object.keys(requestBody).length > 0;
};

// ================ imports ===========================================================================================//

const isValidObjectId = function (ObjectId)
{
    if (!mongoose.Types.ObjectId.isValid(ObjectId))return false
    
    return true;
};

// ================ imports ===========================================================================================//

const isValidTitle = function (title)
{
    return ["Mr","Mrs","Miss"].indexOf(title)!=-1;
};

// ================ imports ===========================================================================================//

const isValidURL = function (link)
{
    return (/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(link));
};

// ================ imports ===========================================================================================//

const isValidMobileNo = function (mobile)
{
    return (/((\+91)?0?)?[6-9]\d{9}$/.test(mobile));
};

// ================ imports ===========================================================================================//

const isValidEmail = function(email)
{
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
};

// ================ imports ===========================================================================================//

const isValidPassword = function (password)
{
    return (/\w{8,15}/.test(password));
};

// ================ ISBN validator ===========================================================================================//

const isValidISBN = function (ISBN)
{
    return (/\d{3}-?\d{10}/.test(ISBN));
};

// ================ exports ===========================================================================================//

module.exports={isValidField,isValidRequestBody,isValidEmail,isValidISBN,isValidMobileNo,isValidURL,isValidTitle,isValidObjectId,isValidPassword};