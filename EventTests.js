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

// ---------------------------------------------------------------------------------------
// --- Test Cases for addCalendarEvent ---
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
// --- Test Cases for getEvent functions ---
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





