const inquirer = require("inquirer");
const mysql2 = require("mysql2");

inquirer
.prompt([{
    type: "list",
    name: "actionSelect",
    message: "What would you like to do?",
    choices: ["Add Department", "View Departments", "Add Role", "View Roles", "Add Employee", "View Employees", "Update Employee Role", "Exit Program"]
}]).then((response) => {

});