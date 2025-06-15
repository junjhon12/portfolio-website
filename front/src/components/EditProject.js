
import React, { useState, useEffect } from 'react';

// This component receives the project to edit and a function to call when saved.
function EditProject({ project, onSave, onCancel }) {
    // This state will hold the form's data as the user types.
    const [formData, setFormData] = useState({ ...project });

    // When the 'project' prop changes (i.e., when we start editing a new project),
    // we need to update the form data to reflect that new project.
    useEffect(() => {
        setFormData({ ...project, technologies: project.technologies.join(', ') });
    }, [project]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Pass the updated form data back to the App component.
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid lightblue', padding: '15px', margin: '10px' }}>
            <h4>Editing: {project.title}</h4>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            <br />
            <textarea name="description" value={formData.description} onChange={handleChange} required />
            <br />
            <input type="text" name="imageURL" value={formData.imageURL} onChange={handleChange} required />
            <br />
            <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} />
            <br />
            <input type="text" name="liveDemoLink" value={formData.liveDemoLink} onChange={handleChange} />
            <br />
            <input type="text" name="githubLink" value={formData.githubLink} onChange={handleChange} />
            <br />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>
        </form>
    );
}

export default EditProject;