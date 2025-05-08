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
    // Input validation
    if (!eventData || 
        typeof eventData.name !== 'string' || 
        eventData.name.trim() === '' || 
        !(eventData.eventStart instanceof Date) ||
        !(eventData.eventEnd instanceof Date) ||
        eventData.eventStart > eventData.eventEnd // eventStart can be equal to eventEnd, but not later than eventEnd
    ) {
        Logger.log('Failed to add calendar event: Required eventData fields (name, eventStart, eventEnd) are missing or invalid.');
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
  
    try {
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
    
        // Log success message with details
        Logger.log(`Calendar event added at ${createdAt}: ID = ${eventId}, Name = ${eventData.name}, Start = ${eventData.eventStart}, End = ${eventData.eventEnd}`);
    
        // Return the complete information of the created calendar event
        return {
            eventId: eventId,
            parentId: eventData.parentId || null,
            name: eventData.name,
            description: eventDescription,
            eventStart: eventData.eventStart,
            eventEnd: eventData.eventEnd,
            createdAt: createdAt
        };
    
    } catch (error) {
        Logger.log(`Failed to add calendar event: ${error}`);
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

    // Validate eventStart and eventEnd if provided
    if (updateData.hasOwnProperty('eventStart') && !(updateData.eventStart instanceof Date)) {
        Logger.log('Error: Invalid eventStart provided. It must be a Date object.');
        return null;
    }

    if (updateData.hasOwnProperty('eventEnd') && !(updateData.eventEnd instanceof Date)) {
        Logger.log('Error: Invalid eventEnd provided. It must be a Date object.');
        return null;
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
            eventStart: updateData.hasOwnProperty('eventStart') ? updateData.eventStart : currentEvent.eventStart,
            eventEnd: updateData.hasOwnProperty('eventEnd') ? updateData.eventEnd : currentEvent.eventEnd,
            parentId: updateData.hasOwnProperty('parentId') ? updateData.parentId : currentEvent.parentId
        };

        // Prepare the updated row data
        const updatedRow = [
            updatedEvent.eventId,
            updatedEvent.parentId,
            updatedEvent.name,
            updatedEvent.description,
            updatedEvent.eventStart,
            updatedEvent.eventEnd,
            updatedEvent.createdAt
        ];

        // Update the row in the sheet
        sheet.getRange(eventRowIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);

        Logger.log(`Calendar event updated: ID = ${eventId}`);
        return updatedEvent;

    } catch (error) {
        Logger.log(`Failed to update calendar event: ${error}`);
        return null;
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
        parentId: row[1],
        name: row[2],
        description: row[3],
        eventStart: new Date(row[4]),
        eventEnd: new Date(row[5]),
        createdAt: new Date(row[6])
    };
}