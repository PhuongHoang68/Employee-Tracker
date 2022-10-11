const connection = require("./config/connection");
const inquirer = require("inquirer");

const runSearch = () => {
    inquirer.prompt({
        type: "rawlist",
        name: "action",
        message: "What would you like to do?",
        choices:[
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role"
        ],
    }). then((answer)=> {
        switch(answer.action){
            case "View All Departments":
                viewAllDepartments();
                break;

            case "View All Roles":
                viewAllRoles();
                break

            case "View All Employees":
                viewAllEmployees();
                break;
            
            case 'Add Department':
                addDepartment();
                break;

            case "Add Role":
                addRole();
                break;
      
            case 'Add Employee':
                addEmployee();
                break;
      
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
      
              default:
                console.log(`Please follow action prompt: ${answer.action}`);
                break;
        }
    });
};




//all viewing functions
const viewAllDepartments= () => {
    connection.query("SELECT name AS Departments FROM department", (err, res) => {
        if (err) throw err
        console.table(res);
        runSearch();
      })
};
const viewAllRoles= () => {
    connection.query("SELECT title AS Title, salary AS Salary FROM role", (err, res)=> {
        if (err) throw err
        console.table(res);
        runSearch();
    })
};
const viewAllEmployees = () => {
    connection.query(" SELECT employee.id, employee.first_name, employee.last_name, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", (err, res) => {
        if (err) throw err
        console.table(res);
        runSearch();
    })
};



//all adding functions
function addDepartment() {
    inquirer.prompt ({
        name: "name",
        type: "input",
        message: "What is the department name?"
    }).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.log("Successfully added a department name!");
                console.table(res);
                runSearch();
            }
        )
    })

};

function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", 
    function (err, res) {
        inquirer.prompt ([
            {
                name: "Title",
                type: "input",
                message: "What is the role title?"
            },
            {
                name: "Salary",
                type: "input",
                message: "What is the role salary?"
            }
        ]).then(
            function(res) {
                connection.query("INSERT INTO role SET?", {
                    title: res.Title,
                    salary: res.Salary,
                  },
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully added an employee role!")
                    console.table(res);
                    runSearch();
                  })
            }
        )
    })

};
function addEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'employeeAdd',
            type: 'input',
            message: 'Enter the first name of the employee you would like to add.',
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee you would like to add.',
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'Select the role of this employee.',
            choices: results.map((item) => item.title),
          },
        ])
        .then((answer) => {
          const roleChosen = results.find(
            (item) => item.title === answer.role_id
          );
          const employeeFirstName = answer.employeeAdd;
          const employeeLastName = answer.last_name;
          connection.query("SELECT * FROM employee", function (err, results) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: 'manager_id',
                  type: 'list',
                  message: 'Select the manager for this employee.',
                  choices: results.map((item) => item.first_name),
                },
              ])
              .then((answer) => {
                const managerChosen = results.find(
                  (item) => item.first_name === answer.manager_id
                );
                connection.query(
                  "INSERT INTO employee SET ?",
                  {
                    first_name: employeeFirstName,
                    last_name: employeeLastName,
                    role_id: roleChosen.id,
                    manager_id: managerChosen.id,
                  },
                  function (err) {
                    if (err) throw err;
                    console.log(
                      "Added " +
                        employeeFirstName +
                        " " +
                        employeeLastName +
                        " to the team!"
                    );
                    runSearch();
                  }
                );
              });
          });
        });
    });
  }



//updating function
const updateEmployeeRole = () => {
    connection.query('SELECT * FROM employee', function (err, results){
        if (err) throw err;
        inquirer.prompt(
            {
            name: 'employeeUpdate',
            type: 'list',
            message: "Choose the employee whose role you would like to update.",
            choices: results.map(employee => employee.first_name)
            }
        )
        .then((answer) => {
            const updateEmployee = (answer.employeeUpdate)
            connection.query('SELECT * FROM role', function (err, results){
                if (err) throw err;
                inquirer
                .prompt([
            {
            name: 'role_id',
            type: 'list',
            message: "Select the new employee role.",
            choices: results.map(role => role.title)
            },
        ])
            .then((answer) => {
                const roleChosen = results.find(role => role.title === answer.role_id)
                connection.query(
                  "UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployee + "'", {
                    role_id: "" + roleChosen.id + "",
                  },
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully updated " + updateEmployee + "'s role to " + answer.role_id + "!");
                    runSearch();
                  }
                )
            })
          })
        })
      })
};


runSearch();