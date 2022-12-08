const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');
const validator = require('../validators/validator');
const { stringVerify, validTitle, isValidObjectId, validValue, validDate, validISBN } = validator

//---------------------------CREATE BOOK----------------------------

const createBook = async function (req, res) {
    try {

        let data = req.body

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!title) { return res.status(400).send({ status: false, message: "Title is required." }); }
        if (!stringVerify(title)) { return res.status(400).send({ status: false, message: "Title should be of type String." }); }


        const checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) { return res.status(400).send({ status: false, message: "Title already used, Please provide another title." }); }


        if (!excerpt) { return res.status(400).send({ status: false, message: "Excerpt is required." }); }
        if (!stringVerify(excerpt)) { return res.status(400).send({ status: false, message: "Excerpt should be of type String." }) }


        if (!userId) { return res.status(400).send({ status: false, message: "UserId is required." }); }
        if (!stringVerify(userId)) { return res.status(400).send({ status: false, message: "UserId should be of type String." }) }


        if (!ISBN) { return res.status(400).send({ status: false, message: "ISBN is required." }); }
        if (!stringVerify(ISBN)) { return res.status(400).send({ status: false, message: "ISBN should be of type String." }); }
        if (!validISBN(ISBN)) { return res.status(400).send({ status: false, message: "ISBN should be in correct format." }); }


        const checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) { return res.status(400).send({ status: false, message: "ISBN already used, Please provide another ISBN." }) }


        if (!category) { return res.status(400).send({ status: false, message: "Category is required." }); }
        if (!stringVerify(category)) { return res.status(400).send({ status: false, message: "Category should be of type String." }); }
        if (!validValue(category)) { return res.status(400).send({ status: false, message: "Category should be in alphabets." }); }


        if (!subcategory) { return res.status(400).send({ status: false, message: "Subcategory is required." }); }
        if (!stringVerify(subcategory)) { return res.status(400).send({ status: false, message: "Subcategory should be of type String." }); }
        if (!validValue(subcategory)) { return res.status(400).send({ status: false, message: "Subcategory should be in alphabets." }); }


        if (!releasedAt) { return res.status(400).send({ status: false, message: "ReleasedAt is required." }); }
        if (!stringVerify(releasedAt)) { return res.status(400).send({ status: false, message: "ReleaseAt should be of type String." }); }
        if (!validDate(releasedAt)) { return res.status(400).send({ status: false, message: "Please enter a valid date format." }); }

        const bookCreated = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: bookCreated });
    }
    catch (error) {
        return res.status(500).send({ staus: false, message: error.message });
    }
}

//--------------------------------GET BOOK-------------------------------

const getBooks = async function (req, res) {
    try {

        const { userId, category, subcategory } = req.query

        if (Object.keys(req.query).length > 0) {
            if (req.query.userId === "") { return res.status(400).send({ status: false, message: "Enter value in userId." }); }
            if (userId) {
                if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Enter a valid user id." }); }
            }

            if (req.query.category === "") { return res.status(400).send({ status: false, message: "Enter value in category." }); }

            if (req.query.subcategory === "") { return res.status(400).send({ status: false, message: "Enter value in subcategory." }); }

            let getbooks = await bookModel.find({ $and: [req.query, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

            if (getbooks.length == 0) {
                return res.status(404).send({ status: false, message: "No books found." });
            }
            return res.status(200).send({ status: true, message: "Books list", data: getbooks });
        }

        const getAllBooks = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (getAllBooks.length == 0) {
            return res.status(404).send({ status: false, message: "No books found." });
        }
        return res.status(200).send({ status: true, message: "Books list", count: getAllBooks.length, data: getAllBooks });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//-------------------------------GET BOOK BY ID-------------------------------

const getBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please provide a valid book id." }); }

        const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ ISBN: 0, __v: 0 }).lean()
        if (!bookData) return res.status(404).send({ status: false, message: "No books found with this id." })

        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        bookData.reviewsData = reviewsData


        return res.status(200).send({ status: true, message: "Books List", data: bookData })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//-------------------------------UPDATE BOOK BY ID---------------------------------

const updateBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter data for updation." }) }

        let { title, excerpt, releasedAt, ISBN } = data

        if (title) {
            if (!stringVerify(title)) { return res.status(400).send({ status: false, message: "Title should be anything but type of String." }) }
        }
        if (!validTitle(title)) return res.status(400).send({ status: false, message: "Can not have empty request for title" })
        const checkTitle = await bookModel.findOne({ title: data.title })
        if (checkTitle) { return res.status(400).send({ status: false, message: "Title is already present." }); }

        if (excerpt) {
            if (!stringVerify(excerpt)) { return res.status(400).send({ status: false, message: "Excerpt should be of type String." }) }
        }

        if (releasedAt) {
            if (!stringVerify(releasedAt)) { return res.status(400).send({ status: false, message: "ReleasedAt should be of type String." }) }
            if (!validDate(releasedAt)) { return res.status(400).send({ status: false, message: "Please enter a valid date format." }); }
        }


        if (ISBN) {
            if (!stringVerify(ISBN)) { return res.status(400).send({ status: false, message: "ISBN should be of type String." }) }

        }
        if (!validTitle(ISBN)) return res.status(400).send({ status: false, message: "Can not have empty request for ISBN" })
        const checkISBN = await bookModel.findOne({ ISBN: data.ISBN })
        if (checkISBN) { return res.status(400).send({ status: false, message: "ISBN is already present." }); }

        const existBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!existBook) { return res.status(404).send({ status: false, message: " No book found with given id." }); }

        const updateData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { title: data.title, excerpt: data.excerpt, ISBN: data.ISBN, releasedAt: data.releasedAt } }, { new: true })

        return res.status(200).send({ status: true, message: "Success", data: updateData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//-------------------------------DELETE BOOK BY ID-------------------------------

const deleteBookById = async function (req, res) {
    try {
        const bookId = req.params.bookId

        const checkBook = await bookModel.findOne({ _id: bookId })
        if (checkBook.isDeleted == true) { return res.status(404).send({ status: false, message: "Book is already deleted." }); }
        if (!checkBook) { return res.status(404).send({ status: false, message: "Book not found." }); }


        const ddata = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })

        return res.status(200).send({ status: true, message: "Book deleted successfully." })
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { createBook, getBooks, getBookById, deleteBookById, updateBookById }