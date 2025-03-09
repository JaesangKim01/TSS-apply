var express = require("express");
var router = express.Router();

const mysql = require("../database")();

const connection = mysql.init();

mysql.db_open(connection);
//연결후 db 상태 확인 알려줌
connection.query("SELECT * FROM  USERS", function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  console.log(results);
});

// 함수 table을 누르면 그 값이 db에 저장되게 하기
function insert_new_task(inserted_task, inserted_deadline) {
  connection.query(
    "insert into users(task, deadline) values(inserted_task,inserted_deadline)"[
      (task, deadline)
    ]
  );
}

/* GET home page. */
router.get("/", function (req, res, next) {
  function compare( a, b ) {
    if ( a.deadline < b.deadline ){
      return -1;
    }
    if ( a.deadline > b.deadline ){
      return 1;
    }
    return 0;
  }
  
  connection.query("SELECT * FROM  USERS", function (error, results, fields) {
    if (error) {
      console.log(error);
      res.render("text", { data: "" });
    } else {
      console.log(results)
      results.sort(compare);
      console.log(results)
      res.render("text", { data: results });
    }
  });
});

module.exports = router;

let database = { task: "", deadline: "" };

router.post("/", function (req, res, next) {
  let task = req.body.task;
  let deadline = req.body.deadline;
  let method = req.body.method;

  // Add entry
  if (method == "POST") {
    // db table 에 값 추가
    var sql = `INSERT INTO users(deadline, task) VALUES ('${deadline}' ,'${task}')`;

    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
    //db 에 추가된건지 확인
    connection.query("SELECT * FROM  USERS", function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(400);
      }
      console.log(results);
    });
  } else if (method == "EDIT") {
    let id = parseInt(req.body.id);
    var sql = "UPDATE users SET deadline=?, task=? WHERE id=?;";
    connection.query(
      sql,
      [deadline, task, (id)],
      function (err, result, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        }
      }
    );
  } else if (method == "DELETE") {
    console.log(req.body)
    let id = parseInt(req.body.id);
    var sql = "DELETE from users WHERE id=?;";
    connection.query(
      sql,
      [id],
      function (err, result, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        }
      }
    );
  }

  res.redirect("/");

  /*let input = document.querySelector('input')
  
  if (input.task!== ''|| input.deadline!==''){
    input.task=''
    input.deadline=''
  }*/

  // db 값을 프론트로 옮기기
  // connection.query('SELECT * FROM users',function(err,rows)     {

  //   if(err){
  //    req.flash('error', err);
  //    res.render('text',{ title:"Users ",userdata:''});
  //   }else{

  //       res.render('text',{title:"Users",userdata:data});
  //   }

  //    });
});

/*function addtask(value1, value2){
  let ul = document.querySelector('ul');
  let li = document.createElement('li');
  let toDo = document.querySelector('input');
  li.innerHTML = `<span class="delete">x</span><input type="checkbox"><label>${value1} ${value2}</label>`;
  ul.appendChild(li);
  document.querySelector('#my-to-do-list').style.display = 'block';

}*/