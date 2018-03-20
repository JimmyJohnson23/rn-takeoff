import { 
    ADD_REMINDER, 
    DELETE_REMINDER, 
    CLEAR_REMINDERS, 
    IS_EDITING_ROW,
    EDIT_REMINDER_TEXT,
    REMINDER_DONE,
    CLEAR_DONE_REMINDERS
} from '../actionTypes';

const reminderAdd = (action) => ({
    text: action.result.text,
    id: Math.random(),
    dueDate: action.result.dueDate
});

const removeByID = (state = [], id) => {
    const reminders = state.filter(r => r.id !== id);
    return reminders;
};

const updateTodoById = (reminderList = [], id, payload, text) => {
    const item = reminderList.find(remainder => remainder.id === id);
    const itemIndex = reminderList.findIndex(remainder => remainder.id === id);
    let updatedItem;
    if(text) {
        delete item.text;
        updatedItem = {text, ...item};
    }
    if(payload) {
        updatedItem = {...item, ...payload};
    }
    const updatedReminderList = [...reminderList];
    updatedReminderList.splice(itemIndex, 1, updatedItem);
    return updatedReminderList;
};

const doneReminder = (reminderList = [], id, payload) => {
    const item = reminderList.find(reminder => reminder.id === id);
    const itemIndex = reminderList.findIndex(reminder => reminder.id === id);
    const updatedItem = {...item, ...payload};
    const updatedReminderList = [...reminderList];
    updatedReminderList.splice(itemIndex, 1, updatedItem);
    return updatedReminderList;
}

const clearDoneReminders = (reminderList = []) => {
    const doneRemindersClearedList = reminderList.filter( (reminder) => reminder.isDone !== true);
    return doneRemindersClearedList;
};

const Reminders = (state = [], action) => {
    let reminders = null;
    const savedReminders = localStorage.getItem('remindlist');
    const currentState = savedReminders ? JSON.parse(savedReminders) : [];
    switch (action.type) {
        case ADD_REMINDER:
            reminders = [...currentState, reminderAdd(action)];
            reminders = reminders.sort((r1, r2) => r1.dueDate > r2.dueDate);
            localStorage.setItem('remindlist', JSON.stringify(reminders));
            return reminders;
        case DELETE_REMINDER:
            reminders = removeByID(currentState, action.result.id);
            reminders = reminders.sort((r1, r2) => r1.dueDate > r2.dueDate);
            localStorage.setItem('remindlist', JSON.stringify(reminders));
            return reminders;
        case CLEAR_REMINDERS:
            reminders = [];
            localStorage.setItem('remindlist', JSON.stringify(reminders));
            return reminders;
        case IS_EDITING_ROW:
            const updatedReminderList = updateTodoById(currentState, action.result.id, {isEditing: action.result.isEditing})
            localStorage.setItem('remindlist', JSON.stringify(updatedReminderList));
            return updatedReminderList;
        case EDIT_REMINDER_TEXT:
            reminders = updateTodoById(currentState, action.result.id, null, action.result.text)
            localStorage.setItem('remindlist', JSON.stringify(reminders));    
            return reminders;
        case REMINDER_DONE:
            reminders = doneReminder(currentState, action.result.id, {isDone: action.result.isDone});
            localStorage.setItem('remindlist', JSON.stringify(reminders));
            return reminders;
        case CLEAR_DONE_REMINDERS:
            reminders = clearDoneReminders(currentState);
            localStorage.setItem('remindlist', JSON.stringify(reminders));
            return reminders;
        default:
            return currentState;
    }
};

export default Reminders;