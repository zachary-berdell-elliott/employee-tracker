const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const connection = require("./lib/connection");


connection.connect(() => {
    mainScreen();
})

//Function that displays the primary screen and allows a user to select which action they would like to do
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
            viewTable("departments");
        }
        else if (response.actionSelect == "Add Role"){
            addRole();
        }
        else if (response.actionSelect == "View Roles"){
            viewTable("roles");
        }
        else if (response.actionSelect == "Add Employee"){
            addEmp();
        }
        else if (response.actionSelect == "View Employees"){
            viewTable("employees");
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
    inquirer.prompt([
        {
            type: "input",
            name: "depName",
            message: "What is the name of this new department?"
        }
    ]).then((response) => {
        connection.query("INSERT INTO departments SET ?", {
            name: response.depName
        });
    });
}

function addRole(){
    //SELECT from departments
    //Ask question what is the title of the new role and what is the salary
    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "roleName",
                message: "What is the name of this new role?"
            },
            {
                type: "input",
                name: "salaryVal",
                message: "What is the salary of this new role?",
                validate: (input) => {

                }
            },
            {
                type: "list",
                name: "depId",
                message: "what department does this new role belong to?",
                choices: res.map(department => department.title)
            }
        ]).then((response) => {
            const insertDepartment = res.find(department => department.title === response.depId);
            connection.query("INSERT INTO roles SET ?", {
                title: response.roleName,
                salary: response.salaryVal,
                department_id: insertDepartment.id
            });
        });
    });
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
            name: "roleId",
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

//Function that allows a user to view a table with the data
function viewTable(table){
    //Selects the table that is provided as an argument and displays it in the console
    connection.query("SELECT * FROM " + table, function(err, res){
        if(err) throw err;
        console.table(res);
        
        //Prompt to allow the user to exit the view to make a better interface
        inquirer.prompt([{
            type: "list",
            name: "exit",
            message: "Select exit when you are done viewing",
            choices: ["exit"]
        }]).then((response) => {
            if (response.exit == "exit"){
                mainScreen();
            }
        });  
    });
}