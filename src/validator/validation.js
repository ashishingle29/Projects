const validPhone=function(mobile){
    const mobileRegex=/^[6789]\d{9}$/

    return mobileRegex.test(mobile)
}
const validEmail=function(email){
     const emailRegex=/^[\w-\.]+@([\w-]+\.)+[\w-][a-z]{1,4}$/
    return emailRegex.test(email)
}
const valid = function (data){
    if(typeof(data)===undefined || typeof(data)===null) { return false}
    if(typeof (data) ==="string" && data.trim().length>0) {return true}
    if (typeof (data) === "number" && data.toString().trim().length > 0) { return true }
}
const ValidName=function(name){
    const nameRegex=/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    return nameRegex.test(name)
}
const isValidPincode = function (data) {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(data);
  }

module.exports = {validPhone,validEmail,valid,ValidName,isValidPincode}