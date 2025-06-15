// back/models/Project.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Blueprint for a single project
const projectSchema = new Schema({
    title: {
        type: String,
        required: true // This means every project MUST have a title
    },
    description: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    technologies: [String], // This defines an array of strings
    liveDemoLink: String, // 'required: false' is the default
    githubLink: String
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// The first argument 'Project' is the singular name of the model.
// Mongoose will automatically look for the plural, lowercased version of this
// which is 'projects' for the collection in the database.
module.exports = mongoose.model('Project', projectSchema);