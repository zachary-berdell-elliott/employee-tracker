const inquirer = require("inquirer");
const mysql2 = require("mysql2");

inquirer
.prompt([{
    type: "list",
    name: "actionSelect",
    message: "What would you like to do?",
    choices: ["Add Department", "View Departments", "Add Role", "View Roles", "Add Employee", "View Employees", "Update Employee Role", "Exit Program"]
}]).then((response) => {
    if(response.actionSelect == "Add Department"){
        //Code for adding a department
    }
    else if (response.actionSelect == "View Departments"){
        //Code for viewing a department
    }
    else if (response.actionSelect == "Add Role"){
        //Code for adding a role
    }
    else if (response.actionSelect == "View Roles"){
        //Code for viewing roles
    }
    else if (response.actionSelect == "Add Employee"){
        //Code for adding an employee
    }
    else if (response.actionSelect == "View Employees"){
        //Code for viewing employees
    }
    else if (response.actionSelect == "Update Employee Role"){

    }
    else {
        console.log("Come back later.");
        return;
    }
});