
import React, { useState, useEffect } from "react";
import AddProject from "../components/AddProject";
import EditProject from "../components/EditProject";
import { useAuth } from "../context/AuthContext";
import "../App.css";

// --- Sub-component for displaying a single project's details ---
// This makes the main list easier to read and manage.
const ProjectItem = ({ project, onEdit, onDelete, isAuthenticated }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
    <div className="flex-grow">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        {project.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {project.description}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <strong>Technologies:</strong> {project.technologies.join(", ")}
      </p>
    </div>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Code
      </a>
      {isAuthenticated && (
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  </div>
);

// --- Sub-component for rendering the list of all projects ---
// This component contains the mapping logic and decides whether to show the
// project details or the edit form.
const ProjectList = ({
  projects,
  editingProject,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  isAuthenticated,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {projects.map((project) =>
      editingProject && editingProject._id === project._id ? (
        // If we are editing THIS project, show the EditProject component
        <EditProject
          key={project._id}
          project={editingProject}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        // Otherwise, show the normal project view
        <ProjectItem
          key={project._id}
          project={project}
          onEdit={() => onEdit(project)}
          onDelete={() => onDelete(project._id)}
          isAuthenticated={isAuthenticated}
        />
      )
    )}
  </div>
);

function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  // Add loading and error states for better UX
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to delete project");
        setProjects(projects.filter((p) => p._id !== projectId));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleUpdate = async (updatedProjectData) => {
    try {
      const response = await fetch(`/api/projects/${updatedProjectData._id}`, {
        method: "PUT",
        headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedProjectData),
        });
      if (!response.ok) throw new Error("Failed to update project");
      const updatedProject = await response.json();
      setProjects(
        projects.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      setEditingProject(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // This function will be passed to AddProject to update the state in App.js
  const handleAddProject = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      {/* --- SIDEBAR --- */}
      {/* The original sidebar is used here, but now it contains the AddProject form */}
      {/* This condition will make the sidebar render only if isAuthenticated is true */}
      {isAuthenticated && (
        <aside
          id="sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800 shadow-md"
        >
          <div className="h-full px-4 py-6 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Portfolio Admin
            </h2>
            {/* We pass the handleAddProject function so AddProject can update the list */}
            <AddProject onProjectAdded={handleAddProject} />
            <button onClick={logout} className="w-full mt-6 bg-gray-600 text-white py-2 rounded hover:bg-gray-700">
                          Logout
                      </button>
          </div>
        </aside>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      {/* The `sm:ml-64` class adds a margin on larger screens to avoid overlapping with the sidebar */}
      <div className={`p-4 sm:p-8 ${isAuthenticated ? 'sm:ml-64' : ''}`}>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Projects
          </h1>
        </header>

        <main>
          {/* ... loading/error messages ... */}
                {!isLoading && !error && (
                    <ProjectList
                        projects={projects}
                        editingProject={editingProject}
                        onEdit={setEditingProject}
                        onCancel={() => setEditingProject(null)}
                        onSave={handleUpdate}
                        onDelete={handleDelete}
                        // Pass the auth status down to the list
                        isAuthenticated={isAuthenticated} 
                    />
                )}
        </main>
      </div>
    </div>
  );
}

export default App;
