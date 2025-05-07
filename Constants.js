// In Google Apps Script, all .js files within the same project share the same global scope.
// --- Sheet Names Constants ---
const PROJECTS_SHEET_NAME = 'Projects';
const TASKS_SHEET_NAME = 'Tasks';
const EVENTS_SHEET_NAME = 'CalendarEvents';

const VALID_PROJECT_STATUSES = new Set([
    'Not yet started',
    'Ahead of schedule',
    'On track',
    'Behind schedule',
    'Stuck',
    'Paused',
    'Completed'
]);

const VALID_TASK_STATUSES = new Set([
    'Not yet started',
    'Ahead of schedule',
    'On track',
    'Behind schedule',
    'Stuck',
    'Paused',
    'Completed'
]);