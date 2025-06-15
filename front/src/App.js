// front/src/App.js
import React, { useState, useEffect } from 'react';
import AddProject from './components/AddProject'; // Import the new component
import './App.css';

function App() {
  // State to store the array of projects
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch data from our new /api/projects endpoint
    fetch('/api/projects')
      .then(response => response.json())
      .then(data => setProjects(data)) // Set the fetched projects into state
      .catch(error => console.error('Error fetching projects:', error));
  }, []); // The empty array ensures this effect runs only once

  const handleDelete = async (projectId) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
          const response = await fetch(`/api/projects/${projectId}`, {
              method: 'DELETE',
          });

          if (!response.ok) {
              throw new Error('Failed to delete project');
          }

          // This is the key to updating the UI in real-time.
          // We filter the projects array, keeping only the ones
          // whose ID does NOT match the one we just deleted.
          setProjects(projects.filter(p => p._id !== projectId));

          console.log('Project deleted successfully');

      } catch (error) {
          console.error('Error deleting project:', error);
      }
    }  
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Portfolio</h1>
      </header>
      <main>
        <AddProject />
        <h2>My Projects</h2>
        {/* Check if projects have been loaded */}
        {projects.length > 0 ? (
          <div>
            {/* Map over the projects array and display each one */}
            {projects.map(project => (
              <div key={project._id} style={{ border: '1px solid grey', margin: '10px', padding: '10px' }}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer">View Code</a>
                <button onClick={() => handleDelete(project._id)} style={{ marginLeft: '10px', backgroundColor: 'salmon' }}>Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading projects...</p>
        )}
      </main>
    </div>
  );
}

export default App;