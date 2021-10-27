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
    db.query("select * from department",(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.table(result);
            return init();
        }
    })
}

async function viewRoles(){
    db.query("select a.id,a.title,b.name as department,a.salary from role as a join department as b on a.department_id=b.id",(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.table(result);
            return init();
        }
    })
}

async function viewEmployees(){
    db.query(`select a.id,a.first_name,a.last_name,b.title,c.name as deparment,b.salary,a.`,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.table(result);
            return init();
        }
    })

}
