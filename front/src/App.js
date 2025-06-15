// front/src/App.js
import React, { useState, useEffect } from "react";
import AddProject from "./components/AddProject";
import EditProject from "./components/EditProject";
import "./App.css";

function App() {
  // State to store the array of projects
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch data from our new /api/projects endpoint
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data)) // Set the fetched projects into state
      .catch((error) => console.error("Error fetching projects:", error));
  }, []); // The empty array ensures this effect runs only once

  const handleDelete = async (projectId) => {
    // Ask for confirmation before deleting
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        // This is the key to updating the UI in real-time.
        // We filter the projects array, keeping only the ones
        // whose ID does NOT match the one we just deleted.
        setProjects(projects.filter((p) => p._id !== projectId));

        console.log("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const [editingProject, setEditingProject] = useState(null);

  const handleUpdate = async (updatedProjectData) => {
    try {
      const response = await fetch(`/api/projects/${updatedProjectData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProjectData),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const updatedProject = await response.json();

      // Update the projects list in the state to reflect the change
      setProjects(
        projects.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );

      // CRUCIAL: Exit edit mode by resetting the editingProject state
      setEditingProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
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
            {projects.map((project) => (
              <div key={project._id}>
                {/* --- THE CONDITIONAL LOGIC --- */}
                {editingProject && editingProject._id === project._id ? (
                  // If we are editing THIS project, show the EditProject component
                  <EditProject
                    project={editingProject}
                    onSave={handleUpdate}
                    onCancel={() => setEditingProject(null)} // Pass a cancel handler
                  />
                ) : (
                  // Otherwise, show the normal project view
                  <div
                    style={{
                      border: "1px solid grey",
                      margin: "10px",
                      padding: "10px",
                    }}
                  >
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <p>
                      <strong>Technologies:</strong>{" "}
                      {project.technologies.join(", ")}
                    </p>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Code
                    </a>

                    {/* The Edit button that TRIGGERS edit mode */}
                    <button
                      onClick={() => setEditingProject(project)}
                      style={{ marginLeft: "10px" }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(project._id)}
                      style={{ marginLeft: "10px", backgroundColor: "salmon" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
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
