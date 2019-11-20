module.exports = {
    formatPhoneNumber,
}

function formatPhoneNumber(phone_number) {
    phone_number = `+${req.body.phone_number.replace(/\D/g,'')}`
    if (phone_number.length < 12) phone_number = phone_number.replace('+', '+1')
    if (phone_number.length < 12 || phone_number.length > 16) return undefined
    else return phone_number
}