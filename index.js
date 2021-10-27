//Import and require inquirer,mysql2,console.table
const inquirer=require("inquirer");
const mysql=require("mysql2");
const cTable=require("console.table");
const art = require("ascii-art")

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'hohoattack',
      database: 'employee_db'
    }
);

start();

async function start(){
    try {
        const rendered = await art.font('Employee Manager', "doom").completed();
        console.log(rendered);
        return init();
      } catch (err) {
        console.log(err);
      }
}

// init function to ask the users what they want to do
async function init(){
    const {action}=await inquirer.prompt([
          {
              type:"list",
              message:"What would you like to do?",
              name:"action",
              choices:["View all departments","View all roles","View all employees","Add a department","Add a role","Add an employee","Update an employee role"],
          }
      ]);
    switch(action){
        case "View all departments":
            return viewDepartment();
        case "View all roles":
            return viewRoles();
        case "View all employees":
            return viewEmployees();
        case "Add a department":
            return addDepartment();
        case "Add a role":
            return addRole();
        case "Add an employee":
            return addEmployee();
        case "Update an employee role":
            return updateEmployee();
    }
}
//function to display department table
async function viewDepartment(){
    db.query("SELECT * from department",(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.table(result);
            return init();
        }
    })
}
//function to display role table
async function viewRoles(){
    db.query("SELECT role.id, role.title,department.name as department, role.salary from role join department on role.department_id=department.id",(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.table(result);
            return init();
        }
    })
}
//function to display employee table
async function viewEmployees(){
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.table(result);
            return init();
        }
    })
}
//function to add a department into the table
async function addDepartment(){
    try{
        const name = await inquirer.prompt([
            {
                name:"name",
                type:"input",
                message:"What is the name of the department?"
            }
        ])
        await db.promise().query("INSERT INTO department set ?",name);
        console.log("Department added.");
        return init();
    } catch(error){
        console.log(error);
    }
}
//function to add a role into the table
async function addRole(){
    try {
        const selectDepartmentSql = `SELECT id,name from department;`;
    
        const [rows] = await db.promise().query(selectDepartmentSql);

        const choices = rows.map((department) => ({
          name: `${department.name}`,
          value: department,
        }));
    
        const { title, salary } = await inquirer.prompt([
          {
            type: "input",
            message: "What is the name of the role?",
            name: "title",
          },
          {
            type: "input",
            message: "What is the salary of the role?",
            name: "salary",
          },
        ]);
        const { department} = await inquirer.prompt([
          {
            type: "list",
            message: "Which department does the role belong to?",
            name: "department",
            choices,
          },
        ]);
    
        const addDepartment = `INSERT INTO role (title,salary,department_id) values(?, ?, ?);`;
        await db
          .promise()
          .query(addDepartment, [
              title,
              salary,
              department.id

          ]
          );
        console.log("Role added.");
        return init();
      } catch (error) {
        console.log(error);
      }
}
//function to add an employee into the table
async function addEmployee(){
    try {
        const selectRoleSql = `SELECT id,title from role;`;
    
        const [rows] = await db.promise().query(selectRoleSql);

        const choices = rows.map(({ id, title }) => ({ name: title, value: id }));

        const selectManagerSql = `SELECT id, CONCAT(first_name, ' ' ,last_name) AS manager FROM employee;`;
    
        const [rows2] = await db.promise().query(selectManagerSql);

        const choices2 = rows2.map(({ id, manager }) => ({ name: manager, value: id }));
    
        const { fName, lName } = await inquirer.prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "fName",
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "lName",
          },
        ]);
        const {title,manager} = await inquirer.prompt([
          {
            type: "list",
            message: "What is the employee's role?",
            name: "title",
            choices:choices
          },
          {
            type: "list",
            message: "Who is the employee's manager?",
            name: "manager",
            choices:choices2
          }
        ]);
    
        const addEmployee = `INSERT INTO employee (first_name,last_name,role_id,manager_id) values(?, ?, ?,?);`;
        await db
          .promise()
          .query(addEmployee, [
              fName,
              lName,
              title,
              manager
          ]
          );
        console.log("Employee added.");
        return init();
      } catch (error) {
        console.log(error);
      }
}
// function to update an employee's role
async function updateEmployee(){
    try {
        const selectEmployeeSql = `SELECT id, CONCAT(first_name, ' ' ,last_name) AS name FROM employee;`;
    
        const [rows] = await db.promise().query(selectEmployeeSql);

        const choices = rows.map(({ id, name }) => ({ name: name, value: id }));

        const selectRoleSql = `SELECT id,title from role;`;
    
        const [rows2] = await db.promise().query(selectRoleSql);

        const choices2 = rows2.map(({ id, title }) => ({ name: title, value: id }));
    
        const { name,role } = await inquirer.prompt([
          {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "name",
            choices:choices
          },
          {
            type: "list",
            message: "Which role do you want to assign the selected employee?",
            name: "role",
            choices:choices2
          },
        ]);
    
        const addEmployee = `UPDATE employee SET role_id=? where id=?;`;
        await db
          .promise()
          .query(addEmployee, [
              role,
              name
          ]
          );
        console.log("Update success.");
        return init();
      } catch (error) {
        console.log(error);
      }
}