//Import and require inquirer,mysql2,console.table
const inquirer=require("inquirer");
const mysql=require("mysql2");


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

// init function to ask the users what they want to do
function init(){
      return inquirer.prompt([
          {
              type:"list",
              message:"What would you like to do?",
              name:"choose",
              choices:["View all departments","View all roles","View all employees","Add a department","Add a role","Add an employee","Update an employee role"],
          }
      ]).then((data)=>{
          switch(data.choose){
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
      });
}

function viewDepartment(){
    db.query("select * from department",(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.table(result);
        }
    })
}

function viewRoles(){
    
}
init();