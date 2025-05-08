// --- Test Runner ---
function runAllAddCalendarEventTests() {
    Logger.log("======== RUNNING ADDCALENDAREVENT TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testAddCalendarEvent_Success_Basic()) allTestsPassed = false;
    if (!testAddCalendarEvent_Success_AllFields()) allTestsPassed = false;
    if (!testAddCalendarEvent_Success_WithParentId()) allTestsPassed = false;
    if (!testAddCalendarEvent_Success_EndEqualStart()) allTestsPassed = false;

    if (!testAddCalendarEvent_Failure_MissingName()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_MissingStartTime()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_MissingEndTime()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_EndBeforeStart()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_InvalidParentIdType()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_EmptyParentIdString()) allTestsPassed = false;
    if (!testAddCalendarEvent_Failure_NonexistentParentId()) allTestsPassed = false;
    if (!testAddCalendarEvent_Warning_InvalidDescriptionType()) allTestsPassed = false;

    Logger.log("======== ADDCALENDAREVENT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL ADDCALENDAREVENT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME ADDCALENDAREVENT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}

function runAllGetCalendarEventTests() {
    Logger.log("======== RUNNING GETCALENDAREVENT TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testGetAllCalendarEvents_Success_Basic()) allTestsPassed = false;
    
    if (!testGetCalendarEventById_Success_Basic()) allTestsPassed = false;
    if (!testGetCalendarEventById_Failure_NotFound()) allTestsPassed = false;
    if (!testGetCalendarEventById_Failure_InvalidId()) allTestsPassed = false;
    
    if (!testGetCalendarEventsByParentId_Success_Basic()) allTestsPassed = false;
    if (!testGetCalendarEventsByParentId_Success_NoChildren()) allTestsPassed = false;

    Logger.log("======== GETCALENDAREVENT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL GETCALENDAREVENT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME GETCALENDAREVENT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}

function runAllUpdateCalendarEventTests() {
    Logger.log("======== RUNNING UPDATECALENDAREVENT TESTS ========");
    let allTestsPassed = true;

    // --- Individual Test Cases ---
    if (!testUpdateCalendarEvent_Success_Basic()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Success_AllFields()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Success_PartialUpdate()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Success_UpdateParentId()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Success_EndEqualStart()) allTestsPassed = false;

    if (!testUpdateCalendarEvent_Failure_InvalidEventId()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Failure_NotFound()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Failure_InvalidUpdateData()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Failure_EndBeforeStart()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Failure_InvalidParentId()) allTestsPassed = false;
    if (!testUpdateCalendarEvent_Failure_NonexistentParentId()) allTestsPassed = false;

    Logger.log("======== UPDATECALENDAREVENT TESTS COMPLETE ========");
    if (allTestsPassed) {
        Logger.log("🎉🎉🎉 ALL UPDATECALENDAREVENT TESTS PASSED! 🎉🎉🎉");
    } else {
        Logger.log("❌❌❌ SOME UPDATECALENDAREVENT TESTS FAILED. Check logs above. ❌❌❌");
    }
    return allTestsPassed;
}

// ---------------------------------------------------------------------------------------
// --- Test Cases for addCalendarEvent functions ---
// ---------------------------------------------------------------------------------------

function testAddCalendarEvent_Success_Basic() {
    Logger.log("\n--- Test: AddCalendarEvent - Success Basic ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
    const input = {
        name: "Basic Event",
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.eventId && result.eventId.startsWith('CE-'), "Result should have an eventId starting with 'CE-'") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.description, "", "Description should default to empty string") && pass;
        pass = assertStrictEquals(result.parentId, null, "ParentId should default to null") && pass;
        pass = assertInstanceOf(result.eventStart, Date, "EventStart should be a Date object") && pass;
        pass = assertInstanceOf(result.eventEnd, Date, "EventEnd should be a Date object") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Success_AllFields() {
    Logger.log("\n--- Test: AddCalendarEvent - Success All Fields ---");
    
    // Create a parent project for this test
    const parentProject = addProject({ 
        name: "Parent for Complete Event", 
        expectTimeSpent: 10 
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project for test");
        return false;
    }
    
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
    const input = {
        name: "Complete Event",
        description: "This event has all fields",
        parentId: parentProject.projectId,
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    let pass = true;

    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertTruthy(result.eventId && result.eventId.startsWith('CE-'), "Result should have an eventId starting with 'CE-'") && pass;
        pass = assertInstanceOf(result.createdAt, Date, "Result should have a createdAt Date object") && pass;
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.description, input.description, "Description should match input") && pass;
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
        pass = assertInstanceOf(result.eventStart, Date, "EventStart should be a Date object") && pass;
        pass = assertInstanceOf(result.eventEnd, Date, "EventEnd should be a Date object") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Success_WithParentId() {
    Logger.log("\n--- Test: AddCalendarEvent - Success With ParentId ---");
    
    // Create a parent task for this test
    const parentTask = addTask({ 
        name: "Parent Task for Event", 
        expectTimeSpent: 5 
    });
    
    if (!parentTask) {
        Logger.log("❌ Failed to create parent task for test");
        return false;
    }
    
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000)); // 1 hour later
    const input = {
        name: "Child Event",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: parentTask.taskId
    };
    const result = addCalendarEvent(input);
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.parentId, input.parentId, "ParentId should match input") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Failure_MissingName() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Missing Name ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when name is missing");
}

function testAddCalendarEvent_Failure_MissingStartTime() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Missing Start Time ---");
    const endTime = new Date();
    const input = {
        name: "Missing Start",
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when eventStart is missing");
}

function testAddCalendarEvent_Failure_MissingEndTime() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Missing End Time ---");
    const startTime = new Date();
    const input = {
        name: "Missing End",
        eventStart: startTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when eventEnd is missing");
}

function testAddCalendarEvent_Success_EndEqualStart() {
    Logger.log("\n--- Test: AddCalendarEvent - Success End Equal Start ---");
    const startTime = new Date();
    const input = {
        name: "End Equal Start",
        eventStart: startTime,
        eventEnd: startTime
    };
    const result = addCalendarEvent(input);
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.name, input.name, "Name should match input") && pass;
        pass = assertStrictEquals(result.eventStart.getTime(), input.eventStart.getTime(), "Start time should match input") && pass;
        pass = assertStrictEquals(result.eventEnd.getTime(), input.eventEnd.getTime(), "End time should match input") && pass;
    }
    return pass;
}

function testAddCalendarEvent_Failure_EndBeforeStart() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure End Time Before Start Time ---");
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() + (1 * 60 * 60 * 1000)); // Start is 1 hour after end
    const input = {
        name: "Invalid Time Order",
        eventStart: startTime,
        eventEnd: endTime
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null when end time is before start time");
}

function testAddCalendarEvent_Failure_InvalidParentIdType() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Invalid ParentId Type ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        name: "Bad ParentId Event",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: 12345
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null for non-string parentId if provided");
}

function testAddCalendarEvent_Failure_EmptyParentIdString() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Empty ParentId String ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        name: "Empty ParentId Event",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: "  "
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null for empty string parentId if provided");
}

function testAddCalendarEvent_Failure_NonexistentParentId() {
    Logger.log("\n--- Test: AddCalendarEvent - Failure Nonexistent ParentId ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        name: "Nonexistent Parent Event",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: "P-DOES-NOT-EXIST-" + Utilities.getUuid()
    };
    const result = addCalendarEvent(input);
    return assertNull(result, "Function should return null for nonexistent parentId");
}

function testAddCalendarEvent_Warning_InvalidDescriptionType() {
    Logger.log("\n--- Test: AddCalendarEvent - Warning Invalid Description Type ---");
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const input = {
        name: "Desc Type Event",
        eventStart: startTime,
        eventEnd: endTime,
        description: 123
    };
    const result = addCalendarEvent(input);
    let pass = true;
    pass = assertTruthy(result, "Function should still create event") && pass;
    if (result) {
        pass = assertStrictEquals(result.description, "", "Description should default to empty string for invalid type") && pass;
    }
    return pass;
}


// ---------------------------------------------------------------------------------------
// --- Test Cases for getCalendarEvent functions ---
// ---------------------------------------------------------------------------------------

function testGetAllCalendarEvents_Success_Basic() {
    Logger.log("\n--- Test: GetAllEvents - Success ---");
    
    // Setup: Add a few test events
    const startTime1 = new Date();
    const endTime1 = new Date(startTime1.getTime() + (1 * 60 * 60 * 1000));
    const event1 = addCalendarEvent({ 
        name: "Test Event 1", 
        eventStart: startTime1, 
        eventEnd: endTime1 
    });
    
    const startTime2 = new Date();
    const endTime2 = new Date(startTime2.getTime() + (2 * 60 * 60 * 1000));
    const event2 = addCalendarEvent({ 
        name: "Test Event 2", 
        eventStart: startTime2, 
        eventEnd: endTime2 
    });
    
    // Execute
    const allEvents = getAllEvents();
    
    // Verify
    let pass = true;
    pass = assertArray(allEvents, "Function should return an array") && pass;
    
    // Check if our test events are in the results
    const foundEvent1 = allEvents.some(e => e.eventId === event1.eventId);
    const foundEvent2 = allEvents.some(e => e.eventId === event2.eventId);
    
    pass = assertTruthy(foundEvent1, `Event 1 (${event1.eventId}) should be in results`) && pass;
    pass = assertTruthy(foundEvent2, `Event 2 (${event2.eventId}) should be in results`) && pass;
    
    return pass;
}

function testGetCalendarEventById_Success_Basic() {
    Logger.log("\n--- Test: GetEventById - Success ---");
    
    // Setup: Add a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (1.5 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({ 
        name: "Find Me Event", 
        description: "This event should be findable by ID",
        eventStart: startTime, 
        eventEnd: endTime 
    });
    
    // Execute
    const foundEvent = getEventById(testEvent.eventId);
    
    // Verify
    let pass = true;
    pass = assertTruthy(foundEvent, "Function should return an event object") && pass;
    
    if (foundEvent) {
        pass = assertStrictEquals(foundEvent.eventId, testEvent.eventId, "Event ID should match") && pass;
        pass = assertStrictEquals(foundEvent.name, testEvent.name, "Event name should match") && pass;
        pass = assertStrictEquals(foundEvent.description, testEvent.description, "Event description should match") && pass;
        pass = assertInstanceOf(foundEvent.eventStart, Date, "Event start should be a Date object") && pass;
        pass = assertInstanceOf(foundEvent.eventEnd, Date, "Event end should be a Date object") && pass;
    }
    
    return pass;
}

function testGetCalendarEventById_Failure_NotFound() {
    Logger.log("\n--- Test: GetEventById - Not Found ---");
    
    // Execute with a non-existent ID
    const nonExistentId = "CE-DOES-NOT-EXIST-" + Utilities.getUuid();
    const result = getEventById(nonExistentId);
    
    // Verify
    return assertNull(result, `Function should return null for non-existent ID (${nonExistentId})`);
}

function testGetCalendarEventById_Failure_InvalidId() {
    Logger.log("\n--- Test: GetEventById - Invalid ID ---");
    
    // Execute with invalid inputs
    const resultNull = getEventById(null);
    const resultUndefined = getEventById(undefined);
    const resultEmpty = getEventById("");
    const resultNumber = getEventById(12345);
    
    // Verify
    let pass = true;
    pass = assertNull(resultNull, "Function should return null for null ID") && pass;
    pass = assertNull(resultUndefined, "Function should return null for undefined ID") && pass;
    pass = assertNull(resultEmpty, "Function should return null for empty string ID") && pass;
    pass = assertNull(resultNumber, "Function should return null for number ID") && pass;
    
    return pass;
}

function testGetCalendarEventsByParentId_Success_Basic() {
    Logger.log("\n--- Test: GetEventsByParentId - Success ---");
    
    // Setup: Create events with a parent ID
    const parentId = "P-TEST-PARENT-" + Utilities.getUuid().substring(0, 8);
    
    const startTime1 = new Date();
    const endTime1 = new Date(startTime1.getTime() + (1 * 60 * 60 * 1000));
    const childEvent1 = addCalendarEvent({ 
        name: "Child Event 1", 
        eventStart: startTime1, 
        eventEnd: endTime1,
        parentId: parentId
    });
    
    const startTime2 = new Date();
    const endTime2 = new Date(startTime2.getTime() + (2 * 60 * 60 * 1000));
    const childEvent2 = addCalendarEvent({ 
        name: "Child Event 2", 
        eventStart: startTime2, 
        eventEnd: endTime2,
        parentId: parentId
    });
    
    // Add an unrelated event
    const startTime3 = new Date();
    const endTime3 = new Date(startTime3.getTime() + (1 * 60 * 60 * 1000));
    const unrelatedEvent = addCalendarEvent({ 
        name: "Unrelated Event", 
        eventStart: startTime3, 
        eventEnd: endTime3
    });
    
    // Execute
    const childEvents = getEventsByParentId(parentId);
    
    // Verify
    let pass = true;
    pass = assertArray(childEvents, "Function should return an array") && pass;
    pass = assertStrictEquals(childEvents.length, 2, `Should find exactly 2 child events, found ${childEvents.length}`) && pass;
    
    // Check if our child events are in the results
    const foundChild1 = childEvents.some(e => e.eventId === childEvent1.eventId);
    const foundChild2 = childEvents.some(e => e.eventId === childEvent2.eventId);
    const foundUnrelated = childEvents.some(e => e.eventId === unrelatedEvent.eventId);
    
    pass = assertTruthy(foundChild1, `Child 1 (${childEvent1.eventId}) should be in results`) && pass;
    pass = assertTruthy(foundChild2, `Child 2 (${childEvent2.eventId}) should be in results`) && pass;
    pass = assertStrictEquals(foundUnrelated, false, "Unrelated event should not be in results") && pass;
    
    return pass;
}

function testGetCalendarEventsByParentId_Success_NoChildren() {
    Logger.log("\n--- Test: GetEventsByParentId - No Children ---");
    
    // Generate a parent ID that likely has no events
    const unusedParentId = "P-UNUSED-" + Utilities.getUuid();
    
    // Execute
    const childEvents = getEventsByParentId(unusedParentId);
    
    // Verify
    let pass = true;
    pass = assertArray(childEvents, "Function should return an array") && pass;
    pass = assertStrictEquals(childEvents.length, 0, "Array should be empty for parent with no children") && pass;
    
    return pass;
}


// ---------------------------------------------------------------------------------------
// --- Test Cases for updateCalendarEvent functions ---
// ---------------------------------------------------------------------------------------

function testUpdateCalendarEvent_Success_Basic() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Success Basic ---");
    
    // Create a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Update",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Update the event
    const updateData = {
        name: "Updated Event Name"
    };
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.eventId, testEvent.eventId, "Event ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, updateData.name, "Name should be updated") && pass;
        pass = assertStrictEquals(result.eventStart.getTime(), testEvent.eventStart.getTime(), "Start time should remain unchanged") && pass;
        pass = assertStrictEquals(result.eventEnd.getTime(), testEvent.eventEnd.getTime(), "End time should remain unchanged") && pass;
    }
    return pass;
}

function testUpdateCalendarEvent_Success_AllFields() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Success All Fields ---");
    
    // Create a parent project for this test
    const parentProject = addProject({
        name: "Parent for Event Update",
        expectTimeSpent: 10
    });
    
    if (!parentProject) {
        Logger.log("❌ Failed to create parent project");
        return false;
    }
    
    // Create a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Full Update",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Update all fields
    const newStartTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000));
    const newEndTime = new Date(newStartTime.getTime() + (3 * 60 * 60 * 1000));
    const updateData = {
        name: "Fully Updated Event",
        description: "Updated description",
        eventStart: newStartTime,
        eventEnd: newEndTime,
        parentId: parentProject.projectId
    };
    
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.eventId, testEvent.eventId, "Event ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, updateData.name, "Name should be updated") && pass;
        pass = assertStrictEquals(result.description, updateData.description, "Description should be updated") && pass;
        pass = assertStrictEquals(result.eventStart.getTime(), updateData.eventStart.getTime(), "Start time should be updated") && pass;
        pass = assertStrictEquals(result.eventEnd.getTime(), updateData.eventEnd.getTime(), "End time should be updated") && pass;
        pass = assertStrictEquals(result.parentId, updateData.parentId, "Parent ID should be updated") && pass;
    }
    return pass;
}

function testUpdateCalendarEvent_Success_PartialUpdate() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Success Partial Update ---");
    
    // Create a test event with all fields
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Partial Update",
        description: "Original description",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Update only description
    const updateData = {
        description: "Updated description only"
    };
    
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.eventId, testEvent.eventId, "Event ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.name, testEvent.name, "Name should remain unchanged") && pass;
        pass = assertStrictEquals(result.description, updateData.description, "Description should be updated") && pass;
        pass = assertStrictEquals(result.eventStart.getTime(), testEvent.eventStart.getTime(), "Start time should remain unchanged") && pass;
        pass = assertStrictEquals(result.eventEnd.getTime(), testEvent.eventEnd.getTime(), "End time should remain unchanged") && pass;
    }
    return pass;
}

function testUpdateCalendarEvent_Success_UpdateParentId() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Success Update ParentId ---");
    
    // Create two parent projects
    const parent1 = addProject({
        name: "Parent 1 for Event",
        expectTimeSpent: 10
    });
    const parent2 = addProject({
        name: "Parent 2 for Event",
        expectTimeSpent: 15
    });
    
    if (!parent1 || !parent2) {
        Logger.log("❌ Failed to create parent projects");
        return false;
    }
    
    // Create a test event with first parent
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Parent Update",
        eventStart: startTime,
        eventEnd: endTime,
        parentId: parent1.projectId
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Update parent ID
    const updateData = {
        parentId: parent2.projectId
    };
    
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.eventId, testEvent.eventId, "Event ID should remain unchanged") && pass;
        pass = assertStrictEquals(result.parentId, parent2.projectId, "Parent ID should be updated") && pass;
    }
    return pass;
}

function testUpdateCalendarEvent_Success_EndEqualStart() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Success End Equal Start ---");
    
    // Create a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Equal Times",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Update to equal times
    const newTime = new Date();
    const updateData = {
        eventStart: newTime,
        eventEnd: newTime
    };
    
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    let pass = true;
    pass = assertTruthy(result, "Function should return an object") && pass;
    if (result) {
        pass = assertStrictEquals(result.eventStart.getTime(), newTime.getTime(), "Start time should be updated") && pass;
        pass = assertStrictEquals(result.eventEnd.getTime(), newTime.getTime(), "End time should be updated") && pass;
    }
    return pass;
}

function testUpdateCalendarEvent_Failure_InvalidEventId() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Failure Invalid EventId ---");
    
    const updateData = { name: "New Name" };
    const result = updateCalendarEvent(null, updateData);
    
    return assertNull(result, "Function should return null for invalid event ID");
}

function testUpdateCalendarEvent_Failure_NotFound() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Failure Not Found ---");
    
    const nonExistentId = "CE-DOES-NOT-EXIST-" + Utilities.getUuid();
    const updateData = { name: "New Name" };
    const result = updateCalendarEvent(nonExistentId, updateData);
    
    return assertNull(result, "Function should return null for non-existent event ID");
}

function testUpdateCalendarEvent_Failure_InvalidUpdateData() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Failure Invalid UpdateData ---");
    
    // Create a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Invalid Update",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    const result = updateCalendarEvent(testEvent.eventId, null);
    
    return assertNull(result, "Function should return null for invalid update data");
}

function testUpdateCalendarEvent_Failure_EndBeforeStart() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Failure End Before Start ---");
    
    // Create a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Invalid Times",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Try to update with end time before start time
    const newStartTime = new Date();
    const newEndTime = new Date(newStartTime.getTime() - (1 * 60 * 60 * 1000));
    const updateData = {
        eventStart: newStartTime,
        eventEnd: newEndTime
    };
    
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    return assertNull(result, "Function should return null when end time is before start time");
}

function testUpdateCalendarEvent_Failure_InvalidParentId() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Failure Invalid ParentId ---");
    
    // Create a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Invalid Parent",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Try to update with invalid parent ID
    const updateData = {
        parentId: 12345 // Invalid type
    };
    
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    return assertNull(result, "Function should return null for invalid parent ID type");
}

function testUpdateCalendarEvent_Failure_NonexistentParentId() {
    Logger.log("\n--- Test: UpdateCalendarEvent - Failure Nonexistent ParentId ---");
    
    // Create a test event
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
    const testEvent = addCalendarEvent({
        name: "Test Event for Nonexistent Parent",
        eventStart: startTime,
        eventEnd: endTime
    });
    
    if (!testEvent) {
        Logger.log("❌ Failed to create test event");
        return false;
    }
    
    // Try to update with non-existent parent ID
    const updateData = {
        parentId: "P-DOES-NOT-EXIST-" + Utilities.getUuid()
    };
    
    const result = updateCalendarEvent(testEvent.eventId, updateData);
    
    return assertNull(result, "Function should return null for non-existent parent ID");
}


