const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
