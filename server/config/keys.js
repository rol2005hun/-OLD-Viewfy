const cloudMongoURI = process.env.MONGOURI;

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
