const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const connection = require("./lib/connection");


connection.connect(() => {
    mainScreen();
})

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
    //Write inquirer question then INSERT INTO
}

function viewDeps(){
    connection.query("SELECT * FROM departments", function(err, res){
        if(err) throw err;
        console.table(res);
        mainScreen();
    })
}

function addRole(){
    //SELECT from departments
    //Ask question what is the title of the new role and what is the salary
}

function viewRoles(){
    connection.query("SELECT * FROM roles", function(err, res){
        if(err) throw err;
        console.table(res);
        mainScreen();
    })
}


function addEmp(){
    connection.query("SELECT * FROM roles", function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employees first name",
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?"
            },
            {
/*Will be similar to department id in add role function*/            name: "roleId",
            message: "What is role of the new employee",
            type: "list",
            choices: res.map( role => role.title)
        },
]).then((response) => {
        const employeeRole = res.find(role => role.title === response.roleId);
        connection.query("INSERT INTO employees SET ?", {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: employeeRole.id
        },
        
        function(){
            console.log("The employee has been added");
            mainScreen();
        })
    })
    })
}

function viewEmps(){
    connection.query("SELECT * FROM employees", function(err, res){
        if(err) throw err;
        console.table(res);
        mainScreen();
    })
}


function updateEmp(){
    connection.query("select * FROM employees", function(err, res){
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            name: "employeeToUpdate",
            message: "What employee would you like to update?",
            choices: res.map(employee => employee.first_name + " " + employee.last_name)
        }]).then((response) => {
            const selectedEmployee = res.find(employee => employee.first_name + " " + employee.last_name === response.employeeToUpdate);
            connection.query("SELECT * FROM ROLES", (err, res) => {
                if (err) throw err;
                inquirer.prompt([{
                    type: "list",
                    name: "newRole",
                    message: "What would you like to change the employees role to?",
                    choices: res.map(role => role.title)
                }]).then((response) => {
                    const selectedRole = res.find(role => role.title === response.newRole);
                    connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [selectedRole.id, selectedEmployee.id]);
                    mainScreen();
                })
            })
        })
    })
}
