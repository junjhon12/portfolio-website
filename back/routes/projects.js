// back/routes/projects.js

const express = require('express');
const router = express.Router();

// We need to import the Project model we just created
const Project = require('../models/Project');

const auth = require('../middleware/authMiddleware');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        // This is a placeholder for now. We'll connect to the DB later.
        // We use the Project model to find all documents in the projects collection.
        const projects = await Project.find();
        res.json(projects);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/projects
// @desc    Add a new project
// @access  Public (for now - later you could secure this)
router.post('/', auth,async (req, res) => {
    try {
        // We get the data from the request body sent by the form
        const { title, description, imageURL, technologies, liveDemoLink, githubLink } = req.body;

        const newProject = new Project({
            title,
            description,
            imageURL,
            // We split the comma-separated string back into an array
            technologies: Array.isArray(technologies) 
                ? technologies 
                : technologies.split(',').map(tech => tech.trim()),
            liveDemoLink,
            githubLink
        });

        // This is the command that saves the new document to the database
        const savedProject = await newProject.save();

        // Send back the newly created project as a confirmation
        res.status(201).json(savedProject);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        // We find the project by its ID, which is passed in the URL
        const project = await Project.findByIdAndDelete(req.params.id);

        // If no project was found with that ID
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        res.json({ msg: 'Project removed successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }        
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, imageURL, technologies, liveDemoLink, githubLink } = req.body;

        // Prepare the updated data object
        const updatedData = {
            title,
            description,
            imageURL,
            technologies: Array.isArray(technologies) 
                ? technologies 
                : technologies.split(',').map(tech => tech.trim()),
            liveDemoLink,
            githubLink
        };

        // Find the project by its ID and update it with the new data.
        // { new: true } tells Mongoose to return the updated document.
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedProject) {
            return res.status(S404).json({ msg: 'Project not found' });
        }

        res.json(updatedProject);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;