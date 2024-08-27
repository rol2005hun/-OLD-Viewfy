const cloudMongoURI = "mongodb+srv://viewfy:viewfy@viewfy.zrgs7.mongodb.net/viewfy?retryWrites=true&w=majority";

if (process.env.NODE_ENV === "production") {
    module.exports = {
        mongoURI: cloudMongoURI,
        secret: "password"
    }
} else {
    module.exports = {
        mongoURI: cloudMongoURI,
        secret: "password"
    }
}
