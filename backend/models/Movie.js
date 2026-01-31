const mongoose = require('mongoose');
const slugify = require('slugify');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
        trim: true,
        index: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    language: {
        type: [String],
        required: [true, 'At least one language is required'],
        index: true
    },
    genre: {
        type: [String],
        required: [true, 'At least one genre is required'],
        index: true
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Duration is required']
    },
    certificate: {
        type: String,
        enum: ['U', 'UA', 'A', 'S'],
        required: [true, 'Certificate is required']
    },
    releaseDate: {
        type: Date,
        required: [true, 'Release date is required'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    posterUrl: {
        type: String,
        required: [true, 'Poster URL is required']
    },
    bannerUrl: {
        type: String,
        required: [true, 'Banner URL is required']
    },
    heroImageUrl: {
        type: String,
        required: false // Optional, can fall back to bannerUrl if needed
    },
    trailerUrl: {
        type: String,
        required: [true, 'Trailer URL is required']
    },
    status: {
        type: String,
        enum: ['NOW_SHOWING', 'COMING_SOON'],
        default: 'COMING_SOON',
        index: true
    },
    formats: {
        type: [String],
        enum: ['2D', '3D', 'IMAX', 'IMAX 3D', '4DX'],
        default: ['2D']
    },
    cast: [{
        name: String,
        role: String,
        imageUrl: String
    }],
    crew: [{
        name: String,
        role: String,
        imageUrl: String
    }],
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to create slug from title before saving
movieSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        return next();
    }
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

// Compound indexes for common search queries
movieSchema.index({ status: 1, releaseDate: 1 });
movieSchema.index({ language: 1, status: 1 });
movieSchema.index({ genre: 1, status: 1 });

module.exports = mongoose.model('Movie', movieSchema);
