// ------------------------------------------------------------------------------------------------
// Create functions
// ------------------------------------------------------------------------------------------------



// JSDoc Comments:
/**
 * Adds a new calendar event to the CalendarEvents worksheet.
 * @param {object} eventData The calendar event data object.
 * {
 * name: string,               // Required: Event name
 * eventStart: Date,          // Required: Event start time
 * eventEnd: Date,            // Required: Event end time
 * description?: string,      // Optional: Event description
 * parentId?: string,         // Optional: Parent project/task ID
 * }
 * @return {object | null} The created calendar event object (including all fields), or null if failed.
 */
function addCalendarEvent(eventData) {
    try {
        // Log the incoming data for debugging
        Logger.log('addCalendarEvent called with data: ' + JSON.stringify(eventData));
        
        // Input validation
        if (!eventData) {
            Logger.log('Failed to add calendar event: eventData is null or undefined');
            return null;
        }
        
        if (typeof eventData.name !== 'string' || eventData.name.trim() === '') {
            Logger.log('Failed to add calendar event: name is missing or invalid');
            return null;
        }
        
        // Check and convert start date if it's an ISO string
        if (!eventData.eventStart) {
            Logger.log('Failed to add calendar event: eventStart is missing');
            return null;
        }
        
        // Convert ISO string to Date object if needed
        if (typeof eventData.eventStart === 'string') {
            try {
                Logger.log('Converting eventStart from string: ' + eventData.eventStart);
                eventData.eventStart = new Date(eventData.eventStart);
                Logger.log('Converted eventStart to: ' + eventData.eventStart);
            } catch (e) {
                Logger.log('Error converting eventStart string to Date: ' + e.message);
                return null;
            }
        }
        
        if (!(eventData.eventStart instanceof Date) || isNaN(eventData.eventStart.getTime())) {
            Logger.log('Failed to add calendar event: eventStart is not a valid Date object');
            return null;
        }
        
        // Check and convert end date if it's an ISO string
        if (!eventData.eventEnd) {
            Logger.log('Failed to add calendar event: eventEnd is missing');
            return null;
        }
        
        // Convert ISO string to Date object if needed
        if (typeof eventData.eventEnd === 'string') {
            try {
                Logger.log('Converting eventEnd from string: ' + eventData.eventEnd);
                eventData.eventEnd = new Date(eventData.eventEnd);
                Logger.log('Converted eventEnd to: ' + eventData.eventEnd);
            } catch (e) {
                Logger.log('Error converting eventEnd string to Date: ' + e.message);
                return null;
            }
        }
        
        if (!(eventData.eventEnd instanceof Date) || isNaN(eventData.eventEnd.getTime())) {
            Logger.log('Failed to add calendar event: eventEnd is not a valid Date object');
            return null;
        }
        
        // Check date order
        if (eventData.eventStart > eventData.eventEnd) {
            Logger.log('Failed to add calendar event: eventStart is after eventEnd');
            return null;
        }

        if (eventData.hasOwnProperty('parentId') && eventData.parentId !== null && eventData.parentId !== undefined) {
            // parentId is provided, now validate it
            if (typeof eventData.parentId !== 'string' || eventData.parentId.trim() === '') {
                Logger.log('Error: Invalid parentId provided. If provided, it must be a non-empty string.');
                return null;
            }

            // Check if the parentId exists in the database (could be either a project or a task)
            const parentProject = getProjectById(eventData.parentId);
            const parentTask = getTaskById(eventData.parentId);
            
            if (!parentProject && !parentTask) {
                Logger.log(`Error: Parent with ID '${eventData.parentId}' does not exist in either projects or tasks.`);
                return null;
            }   
        }
      
        // Get the active spreadsheet and the 'CalendarEvents' worksheet
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(EVENTS_SHEET_NAME);
    
        if (!sheet) {
            throw new Error(`Worksheet "${EVENTS_SHEET_NAME}" not found!`);
        }
  
        // Generate unique ID and creation timestamp
        const eventId = 'CE-' + Utilities.getUuid();
        const createdAt = new Date();
    
        // Get event description or use default value
        let eventDescription = '';
        if (eventData.hasOwnProperty('description')) {
            if (typeof eventData.description === 'string') {
                eventDescription = eventData.description;
            } else {
                Logger.log('Warning: Invalid description provided. It should be a string. Using empty string as default.');
            }
        }

        // Prepare the new row data, ensuring the order matches the header row
        // Header: eventId, parentId, name, description, eventStart, eventEnd, createdAt
        const newRow = [
            eventId,
            eventData.parentId || null, // Use null if parentId is not provided
            eventData.name,
            eventDescription,
            eventData.eventStart,
            eventData.eventEnd,
            createdAt
        ];
  
        // Append the new row to the end of the worksheet
        sheet.appendRow(newRow);
        
        // Log the created event data
        Logger.log(`Calendar event added to spreadsheet: ID=${eventId}, Name=${eventData.name}`);
        Logger.log(`Event times: Start=${eventData.eventStart}, End=${eventData.eventEnd}`);
    
        // Return the complete information of the created calendar event
        return {
            eventId: eventId,
            parentId: eventData.parentId || null,
            name: eventData.name,
            description: eventDescription,
            eventStart: eventData.eventStart.toISOString(),
            eventEnd: eventData.eventEnd.toISOString(),
            createdAt: createdAt.toISOString()
        };
    
    } catch (error) {
        Logger.log(`Failed to add calendar event: ${error}`);
        Logger.log(`Error stack: ${error.stack}`);
        // If any error occurs, return null
        return null;
    }
}



// ------------------------------------------------------------------------------------------------
// Read-only functions
// ------------------------------------------------------------------------------------------------



/**
 * Gets all calendar events from the CalendarEvents worksheet
 * @return {Array<object>} Array of calendar event objects, or empty array if none found
 */
function getAllEvents() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(EVENTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${EVENTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        return data.slice(1).map(row => rowToEvent(row));
        
    } catch (error) {
        Logger.log(`Failed to get all calendar events: ${error}`);
        return [];
    }
}


/**
 * Gets a calendar event by its ID
 * @param {string} eventId The event ID to find
 * @return {object | null} The calendar event object if found, null otherwise
 */
function getEventById(eventId) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(EVENTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${EVENTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        const eventRow = data.slice(1).find(row => row[0] === eventId);
        
        return eventRow ? rowToEvent(eventRow) : null;
        
    } catch (error) {
        Logger.log(`Failed to get calendar event by ID: ${error}`);
        return null;
    }
}



/**
 * Gets all calendar events with a specific parent ID
 * @param {string} parentId The parent project/task ID
 * @return {Array<object>} Array of calendar event objects with the specified parent ID
 */
function getEventsByParentId(parentId) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(EVENTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${EVENTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        return data.slice(1)
            .filter(row => row[1] === parentId)
            .map(row => rowToEvent(row));
        
    } catch (error) {
        Logger.log(`Failed to get calendar events by parent ID: ${error}`);
        return [];
    }
}


// ------------------------------------------------------------------------------------------------
// Update functions
// ------------------------------------------------------------------------------------------------

/**
 * Updates an existing calendar event in the CalendarEvents worksheet.
 * @param {string} eventId The ID of the event to update
 * @param {object} updateData The data to update. Can include:
 * {
 *   name?: string,           // Optional: New event name
 *   description?: string,    // Optional: New event description
 *   eventStart?: Date,       // Optional: New start time
 *   eventEnd?: Date,         // Optional: New end time
 *   parentId?: string        // Optional: New parent project/task ID
 * }
 * @return {object | null} The updated calendar event object, or null if failed
 */
function updateCalendarEvent(eventId, updateData) {
    // Input validation
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
        Logger.log('Error: Invalid eventId provided. It must be a non-empty string.');
        return null;
    }

    if (!updateData || typeof updateData !== 'object') {
        Logger.log('Error: Invalid updateData provided. It must be an object.');
        return null;
    }

    // Convert and validate eventStart if provided
    if (updateData.hasOwnProperty('eventStart')) {
        // Convert ISO string to Date object if needed
        if (typeof updateData.eventStart === 'string') {
            try {
                Logger.log('Converting eventStart from string: ' + updateData.eventStart);
                updateData.eventStart = new Date(updateData.eventStart);
                Logger.log('Converted eventStart to: ' + updateData.eventStart);
            } catch (e) {
                Logger.log('Error converting eventStart string to Date: ' + e.message);
                return null;
            }
        }
        
        if (!(updateData.eventStart instanceof Date) || isNaN(updateData.eventStart.getTime())) {
            Logger.log('Error: Invalid eventStart provided. It must be a valid Date object.');
            return null;
        }
    }

    // Convert and validate eventEnd if provided
    if (updateData.hasOwnProperty('eventEnd')) {
        // Convert ISO string to Date object if needed
        if (typeof updateData.eventEnd === 'string') {
            try {
                Logger.log('Converting eventEnd from string: ' + updateData.eventEnd);
                updateData.eventEnd = new Date(updateData.eventEnd);
                Logger.log('Converted eventEnd to: ' + updateData.eventEnd);
            } catch (e) {
                Logger.log('Error converting eventEnd string to Date: ' + e.message);
                return null;
            }
        }
        
        if (!(updateData.eventEnd instanceof Date) || isNaN(updateData.eventEnd.getTime())) {
            Logger.log('Error: Invalid eventEnd provided. It must be a valid Date object.');
            return null;
        }
    }

    // Validate that eventStart is not after eventEnd if both are provided
    if (updateData.hasOwnProperty('eventStart') && updateData.hasOwnProperty('eventEnd') &&
        updateData.eventStart > updateData.eventEnd) {
        Logger.log('Error: eventStart cannot be later than eventEnd.');
        return null;
    }

    // Validate parentId if provided
    if (updateData.hasOwnProperty('parentId') && updateData.parentId !== null && updateData.parentId !== undefined) {
        if (typeof updateData.parentId !== 'string' || updateData.parentId.trim() === '') {
            Logger.log('Error: Invalid parentId provided. If provided, it must be a non-empty string.');
            return null;
        }

        // Check if the parentId exists in the database
        const parentProject = getProjectById(updateData.parentId);
        const parentTask = getTaskById(updateData.parentId);
        
        if (!parentProject && !parentTask) {
            Logger.log(`Error: Parent with ID '${updateData.parentId}' does not exist in either projects or tasks.`);
            return null;
        }
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(EVENTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${EVENTS_SHEET_NAME}" not found!`);
        }

        const data = sheet.getDataRange().getValues();
        const eventRowIndex = data.slice(1).findIndex(row => row[0] === eventId);
        
        if (eventRowIndex === -1) {
            Logger.log(`Error: Event with ID '${eventId}' not found.`);
            return null;
        }

        // Get the current event data
        const currentEvent = rowToEvent(data[eventRowIndex + 1]);

        // Update only the provided fields
        const updatedEvent = {
            ...currentEvent,
            name: updateData.hasOwnProperty('name') ? updateData.name : currentEvent.name,
            description: updateData.hasOwnProperty('description') ? updateData.description : currentEvent.description,
            eventStartDate: updateData.hasOwnProperty('eventStart') ? updateData.eventStart : new Date(currentEvent.eventStart),
            eventEndDate: updateData.hasOwnProperty('eventEnd') ? updateData.eventEnd : new Date(currentEvent.eventEnd),
            parentId: updateData.hasOwnProperty('parentId') ? updateData.parentId : currentEvent.parentId
        };

        // Prepare the updated row data
        const updatedRow = [
            updatedEvent.eventId,
            updatedEvent.parentId,
            updatedEvent.name,
            updatedEvent.description,
            updatedEvent.eventStartDate,
            updatedEvent.eventEndDate,
            new Date(updatedEvent.createdAt)
        ];

        const updatedEventforReturn = {
            ...updatedEvent,
            eventStartDate: updatedEvent.eventStartDate.toISOString(),
            eventEndDate: updatedEvent.eventEndDate.toISOString()
        };

        // Update the row in the sheet
        sheet.getRange(eventRowIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);

        Logger.log(`Calendar event updated: ID = ${eventId}`);
        return updatedEventforReturn;

    } catch (error) {
        Logger.log(`Failed to update calendar event: ${error}`);
        return null;
    }
}


// ------------------------------------------------------------------------------------------------
// Delete functions
// ------------------------------------------------------------------------------------------------

/**
 * Deletes a calendar event.
 * @param {string} eventId The ID of the event to delete
 * @return {boolean} True if deletion was successful, false otherwise
 */
function deleteEvent(eventId) {
    // Input validation
    if (!eventId || typeof eventId !== 'string' || eventId.trim() === '') {
        Logger.log('Error: Invalid eventId provided. It must be a non-empty string.');
        return false;
    }

    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(EVENTS_SHEET_NAME);
        
        if (!sheet) {
            throw new Error(`Worksheet "${EVENTS_SHEET_NAME}" not found!`);
        }

        // Find and delete the event
        const data = sheet.getDataRange().getValues();
        const eventRowIndex = data.slice(1).findIndex(row => row[0] === eventId);
        
        if (eventRowIndex === -1) {
            Logger.log(`Error: Event with ID '${eventId}' not found.`);
            return false;
        }

        // Delete the row
        sheet.deleteRow(eventRowIndex + 2);

        Logger.log(`Calendar event deleted: ID = ${eventId}`);
        return true;

    } catch (error) {
        Logger.log(`Failed to delete calendar event: ${error}`);
        return false;
    }
}


// ------------------------------------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------------------------------------


/**
 * Converts a row of data into a calendar event object
 * @param {Array} row The row data array
 * @return {object} The calendar event object
 */
function rowToEvent(row) {
    return {
        eventId: row[0],
        parentId: row[1] === "" ? null : row[1],
        name: row[2],
        description: row[3],
        eventStart: new Date(row[4]).toISOString(),
        eventEnd: new Date(row[5]).toISOString(),
        createdAt: new Date(row[6]).toISOString(),
    };
}