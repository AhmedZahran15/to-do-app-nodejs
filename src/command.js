import { Command } from "commander";
import { editTask, getAllTasks, newTask, removeTask, removeAllTasks } from "./todos.js";

const program = new Command();
const STATES = ["to-do", "in-progress", "done"];

program
  .command("add")
  .description("Add a new task")
  .option("-t, --title <title>", "Task title")
  .action(async (options) => {
    const { title } = options;
    if (!title) {
      console.error("Error: Title is required.");
      return;
    }
    const task = await newTask(title);
    console.log("Task added successfully:");
    console.log(task);
  });
program
  .command("list")
  .description("List all tasks")
  .option("-s, --status <status>", "Filter by status")
  .action(async ({ status }) => {
    const tasks = await getAllTasks(status);
    if (tasks.length === 0) {
      console.log("No tasks found.");
    } else {
      console.log("Tasks:");
      tasks.forEach((task) => {
        console.log(`- [${task.status}] ${task.title} (ID: ${task.id})`);
      });
    }
  });

program
  .command("edit")
  .description("Edit a task")
  .option("-t, --title <title>", "Task title")
  .option("-s, --status <status>", "Task status")
  .option("-i, --id <id>", "Task ID")
  .action(async (options) => {
    const { title, status, id } = options;
    if (!id) {
      console.error("Error: ID is required.");
      return;
    }
    if (!title && !status) {
      console.error("Error: At least one of title or status is required.");
      return;
    }
    if (status && !STATES.includes(status)) {
      console.error(
        "Error: Invalid status. Valid statuses are: to-do, in-progress, done."
      );
      return;
    }
    const updatedTask = await editTask(+id, status, title);
    if (updatedTask) {
      console.log("Task updated successfully:");
      console.log(updatedTask);
    } else {
      console.log("Task not found.");
    }
  });

program
  .command("remove")
  .description("Remove a task")
  .option("-i, --id <id>", "Task ID")
  .option("-a, --all", "Remove all tasks")
  .action(async (options) => {
    const { id, all } = options;
    
    if (all) {
      await removeAllTasks();
      console.log("All tasks removed successfully.");
      return;
    }
    
    if (!id) {
      console.error("Error: ID is required when not using --all.");
      return;
    }
    
    const removedTaskId = await removeTask(+id);
    if (removedTaskId) {
      console.log(`Task with ID ${removedTaskId} removed successfully.`);
    } else {
      console.log("Task not found.");
    }
  });
program.parse();
