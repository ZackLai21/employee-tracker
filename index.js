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

async function addRole(){
    try {
        const selectDepartmentSql = `SELECT id,name from department;`;
    
        const [rows] = await db.promise().query(selectDepartmentSql);
    
        // Create array of objects for inquirer choices. Each element is an object
        // with { name: "Description for user", value: trip }
        const choices = rows.map((department) => ({
          name: `${department.name}`,
          value: department,
        }));
    
        // This will be a trip object from the value property in the choices.
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
        console.log("Update success.");
        return init();
      } catch (error) {
        console.log(error);
      }

}

