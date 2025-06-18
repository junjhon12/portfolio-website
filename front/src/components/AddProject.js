import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AddProject() {
    const { token } = useAuth();
    // State object to hold all the form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageURL: '',
        technologies: '',
        liveDemoLink: '',
        githubLink: ''
    });

    // A single handler to update the state object
    const handleChange = (e) => {
        // e.target.name will be 'title', 'description', etc.
        // e.target.value will be the next the user typed
        setFormData({
            ...formData, // Copy the existing form data
            [e.target.name]: e.target.value, // Update the specific field
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data to be sent, including converting the tech string to an array
        const projectData = {
            ...formData,
            technologies: formData.technologies.split(',').map(tech => tech.trim())
        };

        try {
            const response = await fetch('/api/projects', {
                method: 'POST', // We specify the method as POST
                headers: {
                    'Content-Type': 'application/json', // We tell the server we're sending JSON
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(projectData), // We convert our JS object to a JSON string
            });

            if (!response.ok) {
                throw new Error('Failed to add project');
            }

            const newProject = await response.json();
            console.log('Project added successfully:', newProject);
            
            // Simple alert to confirm success
            alert('Project added successfully!');
            
            // Optional: Clear the form after successful submission
            setFormData({
                title: '', description: '', imageURL: '', technologies: '', liveDemoLink: '', githubLink: ''
            });

            // SUPER BONUS: You could also update the project list in App.js here
            // so the new project appears without a page refresh!

        } catch (error) {
            console.error('Error adding project:', error);
            alert('Error adding project. See console for details.');
        }
    };

    return (
        <div>
            <h2>Add a New Project</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" required />
                <br />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
                <br />
                <input type="text" name="imageURL" value={formData.imageURL} onChange={handleChange} placeholder="Image URL" required />
                <br />
                {/* For technologies, we'll input them as a comma-separated string for simplicity */}
                <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="Technologies (comma-separated)" />
                <br />
                <input type="text" name="liveDemoLink" value={formData.liveDemoLink} onChange={handleChange} placeholder="Live Demo Link" />
                <br />
                <input type="text" name="githubLink" value={formData.githubLink} onChange={handleChange} placeholder="GitHub Link" />
                <br />
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
}

export default AddProject;