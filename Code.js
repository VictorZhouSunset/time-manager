// ---------------------------------------------------------------------------------------
// --- Do Get(e) / Do Post(e) Functions--
// ---------------------------------------------------------------------------------------

/**
 * Handles GET requests to the web app.
 * This renders the main HTML interface and handles data requests.
 * 
 * @param {object} e - The event object from the request
 * @return {HtmlOutput|TextOutput} The HTML page or JSON data response
 */
function doGet(e) {
  const params = e.parameter || {};
  const action = params.action || 'home';
  
  // Handle different GET actions
  switch (action) {
    // Data retrieval endpoints
    case 'getAllProjects':
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: getAllProjects(), // Already handles its own errors
        error: null
      })).setMimeType(ContentService.MimeType.JSON);
      
    case 'getAllTasks':
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: getAllTasks(), // Already handles its own errors
        error: null
      })).setMimeType(ContentService.MimeType.JSON);
      
    case 'getAllEvents':
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: getAllEvents(), // Already handles its own errors
        error: null
      })).setMimeType(ContentService.MimeType.JSON);
      
    case 'getProject':
      if (!params.projectId) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: 'Missing projectId parameter'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const project = getProjectById(params.projectId); // Already handles its own errors
      return ContentService.createTextOutput(JSON.stringify({
        success: !!project, // Convert to boolean (null becomes false)
        data: project,
        error: !project ? 'Project not found' : null
      })).setMimeType(ContentService.MimeType.JSON);
      
    case 'getTask':
      if (!params.taskId) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: 'Missing taskId parameter'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const task = getTaskById(params.taskId);
      return ContentService.createTextOutput(JSON.stringify({
        success: !!task,
        data: task,
        error: !task ? 'Task not found' : null
      })).setMimeType(ContentService.MimeType.JSON);
      
    case 'getEvent':
      if (!params.eventId) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: 'Missing eventId parameter'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const event = getEventById(params.eventId);
      return ContentService.createTextOutput(JSON.stringify({
        success: !!event,
        data: event,
        error: !event ? 'Event not found' : null
      })).setMimeType(ContentService.MimeType.JSON);
    
    case 'getChildren':
      if (!params.parentId) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: 'Missing parentId parameter'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const children = getChildrenByParentId(params.parentId); // Already handles its own errors
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: children,
        error: null
      })).setMimeType(ContentService.MimeType.JSON);  
      
    case 'getProjectsByStatus':
      if (!params.status) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: 'Missing status parameter'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Add validation for valid status
      if (!VALID_PROJECT_STATUSES.has(params.status)) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: `Invalid status. Must be one of: ${Array.from(VALID_PROJECT_STATUSES).join(', ')}`
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const projectsByStatus = getProjectsByStatus(params.status);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: projectsByStatus,
        error: null
      })).setMimeType(ContentService.MimeType.JSON);
    
    case 'getTasksByStatus':
      if (!params.status) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: 'Missing status parameter'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Add validation for valid status
      if (!VALID_TASK_STATUSES.has(params.status)) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: `Invalid status. Must be one of: ${Array.from(VALID_TASK_STATUSES).join(', ')}`
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const tasksByStatus = getTasksByStatus(params.status);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: tasksByStatus,
        error: null
      })).setMimeType(ContentService.MimeType.JSON);
    
    // Default: render the main app interface
    default:
      try {
        return HtmlService.createTemplateFromFile('Index')
          .evaluate()
          //.setTitle('Time Manager') // No need for dynamic title yet
          //.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Not embedding in other sites yet
      } catch (error) {
        // We still need error handling for the HTML template rendering
        return HtmlService.createHtmlOutput(
          `<h1>Error Loading App</h1><p>Sorry, the app couldn't be loaded: ${error.message}</p>`
        ).setTitle('Error - Time Manager');
      }
  }
}

/**
 * Handles POST requests to the web app.
 * Used for creating, updating, and deleting data.
 * 
 * @param {object} e - The event object from the request
 * @return {TextOutput} JSON response with operation status
 */
function doPost(e) {
  try {
    let params;
    try {
      params = JSON.parse(e.postData.contents);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        data: null,
        error: 'Invalid JSON data'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const action = params.action;
    if (!action) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        data: null,
        error: 'Missing action parameter'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle different POST actions
    switch (action) {
      // Project operations
      case 'addProject':
        if (!params.projectData) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing projectData parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const newProject = addProject(params.projectData);
        return ContentService.createTextOutput(JSON.stringify({
          success: !!newProject,
          data: newProject,
          error: !newProject ? 'Failed to add project' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'updateProject':
        if (!params.projectId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing projectId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!params.updateData) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing updateData parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }

        // Optional validation - add if helpful
        // const projectToUpdate = getProjectById(params.projectId);
        // if (!projectToUpdate) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Project with ID ${params.projectId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const updatedProject = updateProject(params.projectId, params.updateData);
        return ContentService.createTextOutput(JSON.stringify({
          success: !!updatedProject,
          data: updatedProject,
          error: !updatedProject ? 'Failed to update project' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'deleteProject':
        if (!params.projectId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing projectId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const projectToDelete = getProjectById(params.projectId);
        // if (!projectToDelete) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Project with ID ${params.projectId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }
        const deleteResult = deleteProject(params.projectId);
        return ContentService.createTextOutput(JSON.stringify({
          success: deleteResult,
          data: null,
          error: !deleteResult ? 'Failed to delete project' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'removeProject':
        if (!params.projectId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing projectId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const projectToRemove = getProjectById(params.projectId);
        // if (!projectToRemove) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Project with ID ${params.projectId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const removeResult = removeProject(params.projectId);
        return ContentService.createTextOutput(JSON.stringify({
          success: removeResult,
          data: null,
          error: !removeResult ? 'Failed to remove project' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'removeProjectWithEvents':
        if (!params.projectId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing projectId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const projectToRemoveWithEvents = getProjectById(params.projectId);
        // if (!projectToRemoveWithEvents) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Project with ID ${params.projectId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const removeWithEventsResult = removeProjectWithEvents(params.projectId);
        return ContentService.createTextOutput(JSON.stringify({
          success: removeWithEventsResult,
          data: null,
          error: !removeWithEventsResult ? 'Failed to remove project with events' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      // Task operations
      case 'addTask':
        if (!params.taskData) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing taskData parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const newTask = addTask(params.taskData);
        return ContentService.createTextOutput(JSON.stringify({
          success: !!newTask,
          data: newTask,
          error: !newTask ? 'Failed to add task' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'updateTask':
        if (!params.taskId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing taskId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!params.updateData) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing updateData parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const taskToUpdate = getTaskById(params.taskId);
        // if (!taskToUpdate) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Task with ID ${params.taskId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const updatedTask = updateTask(params.taskId, params.updateData);
        return ContentService.createTextOutput(JSON.stringify({
          success: !!updatedTask,
          data: updatedTask,
          error: !updatedTask ? 'Failed to update task' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'deleteTask':
        if (!params.taskId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing taskId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const taskToDelete = getTaskById(params.taskId);
        // if (!taskToDelete) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Task with ID ${params.taskId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const deleteTaskResult = deleteTask(params.taskId);
        return ContentService.createTextOutput(JSON.stringify({
          success: deleteTaskResult,
          data: null,
          error: !deleteTaskResult ? 'Failed to delete task' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'removeTask':
        if (!params.taskId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing taskId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const taskToRemove = getTaskById(params.taskId);
        // if (!taskToRemove) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Task with ID ${params.taskId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const removeTaskResult = removeTask(params.taskId);
        return ContentService.createTextOutput(JSON.stringify({
          success: removeTaskResult,
          data: null,
          error: !removeTaskResult ? 'Failed to remove task' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'removeTaskWithEvents':
        if (!params.taskId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing taskId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const taskToRemoveWithEvents = getTaskById(params.taskId);
        // if (!taskToRemoveWithEvents) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Task with ID ${params.taskId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const removeTaskWithEventsResult = removeTaskWithEvents(params.taskId);
        return ContentService.createTextOutput(JSON.stringify({
          success: removeTaskWithEventsResult,
          data: null,
          error: !removeTaskWithEventsResult ? 'Failed to remove task with events' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      // Calendar Event operations
      case 'addEvent':
        if (!params.eventData) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing eventData parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Convert string dates to Date objects
        if (params.eventData.eventStart && typeof params.eventData.eventStart === 'string') {
          params.eventData.eventStart = new Date(params.eventData.eventStart);
        }
        
        if (params.eventData.eventEnd && typeof params.eventData.eventEnd === 'string') {
          params.eventData.eventEnd = new Date(params.eventData.eventEnd);
        }
        
        const newEvent = addCalendarEvent(params.eventData);
        return ContentService.createTextOutput(JSON.stringify({
          success: !!newEvent,
          data: newEvent,
          error: !newEvent ? 'Failed to add event' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'updateEvent':
        if (!params.eventId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing eventId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!params.updateData) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing updateData parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Convert string dates to Date objects
        if (params.updateData.eventStart && typeof params.updateData.eventStart === 'string') {
          params.updateData.eventStart = new Date(params.updateData.eventStart);
        }
        
        if (params.updateData.eventEnd && typeof params.updateData.eventEnd === 'string') {
          params.updateData.eventEnd = new Date(params.updateData.eventEnd);
        }

        // Validate that eventEnd is not before eventStart
        if (params.updateData.eventStart && params.updateData.eventEnd) {
          if (params.updateData.eventEnd < params.updateData.eventStart) {
            return ContentService.createTextOutput(JSON.stringify({
              success: false,
              data: null,
              error: 'Event end time cannot be before start time'
            })).setMimeType(ContentService.MimeType.JSON);
          }
        } else if (params.updateData.eventEnd && !params.updateData.eventStart) {
          // If only updating end time, need to check against the existing event's start time
          const existingEvent = getEventById(params.eventId);
          if (existingEvent && params.updateData.eventEnd < existingEvent.eventStart) {
            return ContentService.createTextOutput(JSON.stringify({
              success: false,
              data: null,
              error: 'Event end time cannot be before start time'
            })).setMimeType(ContentService.MimeType.JSON);
          }
        } else if (params.updateData.eventStart && !params.updateData.eventEnd) {
          // If only updating start time, need to check against the existing event's end time
          const existingEvent = getEventById(params.eventId);
          if (existingEvent && params.updateData.eventStart > existingEvent.eventEnd) {
            return ContentService.createTextOutput(JSON.stringify({
              success: false,
              data: null,
              error: 'Event start time cannot be after end time'
            })).setMimeType(ContentService.MimeType.JSON);
          }
        }

        const updatedEvent = updateCalendarEvent(params.eventId, params.updateData);
        return ContentService.createTextOutput(JSON.stringify({
          success: !!updatedEvent,
          data: updatedEvent,
          error: !updatedEvent ? 'Failed to update event' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      case 'deleteEvent':
        if (!params.eventId) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            data: null,
            error: 'Missing eventId parameter'
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Optional validation - add if helpful
        // const eventToDelete = getEventById(params.eventId);
        // if (!eventToDelete) {
        //     return ContentService.createTextOutput(JSON.stringify({
        //     success: false,
        //     data: null,
        //     error: `Event with ID ${params.eventId} not found`
        //     })).setMimeType(ContentService.MimeType.JSON);
        // }

        const deleteEventResult = deleteEvent(params.eventId);
        return ContentService.createTextOutput(JSON.stringify({
          success: deleteEventResult,
          data: null,
          error: !deleteEventResult ? 'Failed to delete event' : null
        })).setMimeType(ContentService.MimeType.JSON);
        
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          data: null,
          error: `Unknown action: ${action}`
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    // Global error handler
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      data: null,
      error: `Server error: ${error.message}`
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------------------------------------------------------------------------------------
// --- Get Functions ---
// ---------------------------------------------------------------------------------------

/**
 * Gets all direct child items (both projects and tasks) of a specific parent ID
 * @param {string} parentId The parent project/task ID
 * @return {object} Object containing arrays of child projects and tasks
 */
function getChildrenByParentId(parentId) {
    try {
        const childProjects = getProjectsByParentId(parentId);
        const childTasks = getTasksByParentId(parentId);

        return {
            projects: childProjects,
            tasks: childTasks,
            // Helper methods for the returned object
            getAllChildren() {
                return [...this.projects, ...this.tasks].sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
            },
            // Get total count of direct children
            getChildCount() {
                return this.projects.length + this.tasks.length;
            }
        };
    } catch (error) {
        Logger.log(`Failed to get children by parent ID: ${error}`);
        return {
            projects: [],
            tasks: [],
            getAllChildren() { return []; },
            getChildCount() { return 0; }
        };
    }
}

/**
 * Gets all descendants (recursive children) of a specific parent ID
 * Warning: There is no detection for circular dependencies now
 * Warning: This function can be resource-intensive for deep hierarchies
 * @param {string} parentId The parent project/task ID
 * @return {object} Object containing arrays of all descendant projects and tasks
 */
function getAllDescendantsByParentId(parentId) {
    try {
        const result = {
            projects: [],
            tasks: []
        };

        // Get direct children first
        const directChildren = getChildrenByParentId(parentId);
        result.projects.push(...directChildren.projects);
        result.tasks.push(...directChildren.tasks);

        // Recursively get children of projects
        for (const project of directChildren.projects) {
            const descendants = getAllDescendantsByParentId(project.projectId);
            result.projects.push(...descendants.projects);
            result.tasks.push(...descendants.tasks);
        }

        // Recursively get children of tasks
        for (const task of directChildren.tasks) {
            const descendants = getAllDescendantsByParentId(task.taskId);
            result.projects.push(...descendants.projects);
            result.tasks.push(...descendants.tasks);
        }

        return {
            ...result,
            // Helper methods
            getAllDescendants() {
                return [...this.projects, ...this.tasks].sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
            },
            getDescendantCount() {
                return this.projects.length + this.tasks.length;
            }
        };

    } catch (error) {
        Logger.log(`Failed to get all descendants by parent ID: ${error}`);
        return {
            projects: [],
            tasks: [],
            getAllDescendants() { return []; },
            getDescendantCount() { return 0; }
        };
    }
}


// ---------------------------------------------------------------------------------------
// --- Include Functions ---
// ---------------------------------------------------------------------------------------

/**
 * Includes the content of an HTML file (like a CSS or JS file) into another HTML template.
 * @param {string} filename The name of the HTML file to include (without .html extension).
 * @return {string} The content of the file.
 */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }


// ---------------------------------------------------------------------------------------
// --- Wrapper Functions ---
// ---------------------------------------------------------------------------------------

// ProjectService Wrapper Functions
function core_addProject(projectDataFromClient) {
  try {
    const newProject = addProject(projectDataFromClient);
    return { success: true, data: newProject };
  } catch (e) {
    Logger.log('Error in addProject: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getAllProjects() {
  try {
    const projects = getAllProjects();
    return { success: true, data: projects };
  } catch (e) {
    Logger.log('Error in getAllProjects: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}


function core_getProjectById(projectId) {
  try {
    const project = getProjectById(projectId);
    return { success: true, data: project };
  } catch (e) {
    Logger.log('Error in getProjectById: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getProjectsByParentId(parentId) {
  try {
    const projects = getProjectsByParentId(parentId);
    return { success: true, data: projects };
  } catch (e) {
    Logger.log('Error in getProjectsByParentId: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getProjectsByStatus(status) {
  try {
    const projects = getProjectsByStatus(status);
    return { success: true, data: projects };
  } catch (e) {
    Logger.log('Error in getProjectsByStatus: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_updateProject(projectId, updateData) {
  try {
    const updatedProject = updateProject(projectId, updateData);
    return { success: true, data: updatedProject };
  } catch (e) {
    Logger.log('Error in updateProject: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_deleteProject(projectId) {
  try {
    const result = deleteProject(projectId);
    return { success: result, data: null };
  } catch (e) {
    Logger.log('Error in deleteProject: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

// TaskService Wrapper Functions
function core_addTask(taskDataFromClient) {
  try {
    const newTask = addTask(taskDataFromClient);
    return { success: true, data: newTask };
  } catch (e) {
    Logger.log('Error in addTask: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getAllTasks() {
  try {
    const tasks = getAllTasks();
    return { success: true, data: tasks };
  } catch (e) {
    Logger.log('Error in getAllTasks: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getTaskById(taskId) {
  try {
    const task = getTaskById(taskId);
    return { success: true, data: task };
  } catch (e) {
    Logger.log('Error in getTaskById: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getTasksByParentId(parentId) {
  try {
    const tasks = getTasksByParentId(parentId);
    return { success: true, data: tasks };
  } catch (e) {
    Logger.log('Error in getTasksByParentId: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getTasksByStatus(status) {
  try {
    const tasks = getTasksByStatus(status);
    return { success: true, data: tasks };
  } catch (e) {
    Logger.log('Error in getTasksByStatus: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_updateTask(taskId, updateData) {
  try {
    const updatedTask = updateTask(taskId, updateData);
    return { success: true, data: updatedTask };
  } catch (e) {
    Logger.log('Error in updateTask: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_deleteTask(taskId) {
  try {
    const result = deleteTask(taskId);
    return { success: result, data: null };
  } catch (e) {
    Logger.log('Error in deleteTask: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

// EventService Wrapper Functions
function core_addCalendarEvent(eventDataFromClient) {
  try {
    const newEvent = addCalendarEvent(eventDataFromClient);
    return { success: true, data: newEvent };
  } catch (e) {
    Logger.log('Error in addCalendarEvent: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getAllEvents() {
  try {
    const events = getAllEvents();
    return { success: true, data: events };
  } catch (e) {
    Logger.log('Error in getAllEvents: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getEventById(eventId) {
  try {
    const event = getEventById(eventId);
    return { success: true, data: event };
  } catch (e) {
    Logger.log('Error in getEventById: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_getEventsByParentId(parentId) {
  try {
    const events = getEventsByParentId(parentId);
    return { success: true, data: events };
  } catch (e) {
    Logger.log('Error in getEventsByParentId: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_updateCalendarEvent(eventId, updateData) {
  try {
    const updatedEvent = updateCalendarEvent(eventId, updateData);
    return { success: true, data: updatedEvent };
  } catch (e) {
    Logger.log('Error in updateCalendarEvent: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

function core_deleteEvent(eventId) {
  try {
    const result = deleteEvent(eventId);
    return { success: result, data: null };
  } catch (e) {
    Logger.log('Error in deleteEvent: ' + e.toString() + ' Stack: ' + e.stack);
    return { success: false, error: e.message };
  }
}

