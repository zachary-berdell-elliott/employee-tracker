const inquirer = require("inquirer");
const mysql2 = require("mysql2");

function mainScreen(){
    inquirer
    .prompt([{
        type: "list",
        name: "actionSelect",
        message: "What would you like to do?",
        choices: ["Add Department", "View Departments", "Add Role", "View Roles", "Add Employee", "View Employees", "Update Employee Role", "Exit Program"]
    }]).then((response) => {
        if(response.actionSelect == "Add Department"){
            addDep();
        }
        else if (response.actionSelect == "View Departments"){
            viewDeps();
        }
        else if (response.actionSelect == "Add Role"){
            addRole();
        }
        else if (response.actionSelect == "View Roles"){
            viewRoles();
        }
        else if (response.actionSelect == "Add Employee"){
            addEmp();
        }
        else if (response.actionSelect == "View Employees"){
            viewEmps();
        }
        else if (response.actionSelect == "Update Employee Role"){
            updateEmp();
        }
        else {
            console.log("Come back later.");
            return;
        }
    });
}

function addDep(){

}

function viewDeps(){

}

function addRole(){

}

function viewRoles(){

}

function addEmp(){

}

function viewEmps(){

}

function updateEmp(){
    
}

mainScreen();