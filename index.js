//Required modules
const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const { listenerCount } = require("./lib/connection");
const connection = require("./lib/connection");

//Initializes the SQL connection
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
        choices: ["Add Department", "View Departments", "Delete Department", "Add Role", "View Roles", "Delete Role", "Add Employee", "View Employees", "Delete Employee", "Update Employee Role", "View By Department", "View By Manager", "Update Employee Manager", "Exit Program"]
    }]).then((response) => {
        //Runs the correct function for each option the user can select
        if(response.actionSelect == "Add Department"){
            addDep();
        }
        else if (response.actionSelect == "View Departments"){
            viewTable("departments");
        }
        else if (response.actionSelect == "Delete Department"){
            delDep();
        }
        else if (response.actionSelect == "Add Role"){
            addRole();
        }
        else if (response.actionSelect == "View Roles"){
            viewTable("roles");
        }
        else if (response.actionSelect == "Delete Role"){
            delRole();
        }
        else if (response.actionSelect == "Add Employee"){
            addEmp();
        }
        else if (response.actionSelect == "View Employees"){
            viewTable("employees");
        }
        else if (response.actionSelect == "Delete Employee"){
            delEmp();
        }
        else if (response.actionSelect == "Update Employee Role"){
            updateEmp();
        }
        else if (response.actionSelect == "View By Department"){
            
        }
        else if (response.actionSelect == "View By Manager"){

        }
        else if (response.actionSelect == "Update Employee Manager"){

        }
        else {
            console.log("Come back later.");
            return;
        }
    });
}

//Adds departments
function addDep(){
    //inquirer question for department name then INSERT INTO to add it to the table
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
        console.log("Department added");
        mainScreen();
    });
}

//Adds roles
function addRole(){
    //Connection to department table to present user with a list of departments top add the role to
    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        //Prompts the user to enter the neccessary information
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
                //Makes sure the salary is a valid number
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
            //Adds the role to the table
            const insertDepartment = res.find(department => department.title === response.depId);
            connection.query("INSERT INTO roles SET ?", {
                title: response.roleName,
                salary: response.salaryVal,
                department_id: insertDepartment.id
            });
        });
    });
}

//Adds employees
function addEmp(){
    //Connects to the roles table so the user can select a role
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
        //Adds employee to the table
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

//Updates the role of an employee
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
                    console.log("Employee role updated successfully")
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

//Deletes a department from the table
function delDep() {
    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            name: "depToDel",
            message: "Which department would you like to delete?",
            choices: res.map(department => department.name)//.push("Cancel")
        }]).then((response) => {
            var depToDelName = response.depToDel;
            var depToDel = res.find(department => department.name === response.depToDel)
            if (depToDelName == "Cancel"){
                mainScreen();
            }
            else{
                inquirer.prompt([{
                    type: "list",
                    name: "delConfirmation",
                    message: `Are you sure you would like to remove ${depToDelName}`,
                    choices: ["yes", "no"]
                }]).then((response) => {
                    if (response.delConfirmation == "no"){
                        mainScreen();
                    }
                    else{
                        connection.query("DELETE FROM departments WHERE id = ?", depToDel.id);
                        console.log("The department has been remove successfully");
                        mainScreen();
                    }
                })
            }
        })
    })
}

//Deletes a role from the table
function delRole() {
    connection.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            name: "roleToDel",
            message: "Which role would you like to delete?",
            choices: res.map(role => role.title)//.push("Cancel")
        }]).then((response) => {
            var roleToDelName = response.depToDel;
            var roleToDel = res.find(role => role.title === response.roleToDel)
            if (roleToDelName == "Cancel"){
                mainScreen();
            }
            else{
                inquirer.prompt([{
                    type: "list",
                    name: "delConfirmation",
                    message: `Are you sure you would like to remove ${roleToDelName}`,
                    choices: ["yes", "no"]
                }]).then((response) => {
                    if (response.delConfirmation == "no"){
                        mainScreen();
                    }
                    else{
                        connection.query("DELETE FROM roles WHERE id = ?", roleToDel.id);
                        console.log("The role has been remove successfully");
                        mainScreen();
                    }
                })
            }
        })
    })
}

//Deletes an employee from the table
function delEmp() {
    connection.query("SELECT * FROM employees", (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            name: "empToDel",
            message: "Which employee would you like to delete?",
            choices: res.map(employee => employee.first_name + " " + employee.last_name)//.push("Cancel")
        }]).then((response) => {
            var empToDelName = response.empToDel;
            var empToDel = res.find(employee => employee.first_name + " " + employee.last_name === response.empToDel)
            if (empToDelName == "Cancel"){
                mainScreen();
            }
            else{
                inquirer.prompt([{
                    type: "list",
                    name: "delConfirmation",
                    message: `Are you sure you would like to remove ${empToDelName}`,
                    choices: ["yes", "no"]
                }]).then((response) => {
                    if (response.delConfirmation == "no"){
                        mainScreen();
                    }
                    else{
                        connection.query("DELETE FROM employees WHERE id = ?", empToDel.id);
                        console.log("The employee has been remove successfully");
                        mainScreen();
                    }
                })
            }
        })
    })
}