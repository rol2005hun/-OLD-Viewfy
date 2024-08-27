const Joi = require('@hapi/joi');

const replyValidation = (data) => {
    const schema = Joi.object({
        reply: Joi.string().min(2).required(),
        upvotes: Joi.required(),
        downvotes: Joi.required(),
        ownerId: Joi.string().min(6).required(),
        ownerName: Joi.string().min(6).required()
    });

    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    return schema.validate(data, options);
}

const commentValidation = (data) => {
    const schema = Joi.object({
        comment: Joi.string().min(2).required(),
        upvotes: Joi.required(),
        downvotes: Joi.required(),
        ownerId: Joi.string().min(6).required(),
        ownerName: Joi.string().min(6).required()
    });

    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    return schema.validate(data, options);
}

const postValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(6).required(),
        image: Joi.string().min(6).required(),
        privacy: Joi.string().min(6).required(),
    });

    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    return schema.validate(data, options);
};



const followUserValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
    });

    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    return schema.validate(data, options);
};

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.string().min(6).required(),
        image: Joi.string().required(),
    });

    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    return schema.validate(data, options);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required().messages({
            'string.base': `Kérlek valós felhasználónevet adj meg.`,
            'string.empty': `Kérlek írd be a felhasználónevedet.`,
            'string.min': `A felhasználóneved minimum {#limit} karakter hosszú kell legyen`,
            'any.required': `A felhasználónév mező kötelező.`
        }),
        password: Joi.string().min(6).required().messages({
            'string.base': `Kérlek valós jelszót adj meg.`,
            'string.empty': `Kérlek írd be a jelszavadat.`,
            'string.min': `A jelszavad minimum {#limit} karakter hosszú kell legyen.`,
            'any.required': `A jelszó mező kötelező.`
        }),
    });

    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };
    return schema.validate(data, options);
};
module.exports.postValidation = postValidation;
module.exports.commentValidation = commentValidation;
module.exports.replyValidation = replyValidation;
module.exports.followUserValidation = followUserValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
