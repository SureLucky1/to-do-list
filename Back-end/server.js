const mongoose = require('mongoose');
const http = require('http');
const { Router, json } = require('./router');
const today = require('./TaskModel');
const todayDetail = require('./DetailModel');
const regular = require('./RegularModel');
let router = new Router();
require('dotenv').config();
const url = process.env.DATABASE_URL;
// 創建伺服器
const server = http.createServer((req, res) => {
  if (req.method == 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }
  router.resolve(req, res);
});


async function main() {    
  try { 
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB via Mongoose'))
      .catch(err => console.error('Connection error', err));
    

    // 啟動伺服器
    server.listen(8080, () => {
      console.log('伺服器正在 http://127.0.0.1:8080/ 上運行');
    });

  } catch (err) {
    console.error('連接到資料庫時發生錯誤', err);
  }
}
    // 定義 PUT 路由，使用 `{ req, res }`
    router.put('/newlist', async ({ req, res }) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          // 正確解析前端傳來的資料
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          console.log(JSON.parse(body))
          const { date, taskList  } = JSON.parse(body);


          const existingTask = await today.findOne({ date: date });          
          console.log(existingTask);  
if (!existingTask) {
            // 新增文件，list 為一個包含一筆資料的陣列
            const newTask = new today({ date: date, task: taskList});
            await newTask.save();
          } else {  
            // 在MongoDB中更新資料
            await today.updateOne({ date: date }, { task: taskList });
}          

                      res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Task inserted successfully' }));

        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
        }
      });
    });
    router.post('/newlist', async ({ req, res }) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          // 正確解析前端傳來的資料
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          const { task, date } = JSON.parse(body);

          //console.log(task);  

 const existingTask = await today.findOne({ date: date });          
if (existingTask)  {  
            //在MongoDB中更新資料, 更新陣列中第一個符合條件的任務
            console.log(existingTask);
            await today.updateOne(
              { date: date, "task.name":  task, "task.completed": false },
              { $set: { "task.$.completed": true } }
            );
            
}          
                      res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Task inserted successfully' }));

        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
        }
      });
    });

    router.post("/regular", async({req, res})=>{
      let body = "";
      req.on("data", chunk =>{
      body += chunk.toString();
      })
      req.on("end", async()=>{
      res.setHeader("Access-Control-Allow-Origin", "*"),
      res.setHeader("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET, OPTIONS"),
      res.setHeader("Access-Control-Allow-Headers", "Content-Type")
      const {task} = JSON.parse(body);
      console.log(task)
      const exist = await regular.findOne({});
      if(exist){
   const selected = exist.task.find(item => item.name === task);    
   console.log(selected) 
   if(selected){
       await regular.updateOne(
     { "task.name": task, "task.completed": false },
     { $set: { "task.$.completed": true } }
   );
   }

      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Task inserted successfully' }));
      })
      })
      router.post("/regular-reset", async ({req, res}) => {
        let body = "";
        req.on("data", chunk => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          
          try {
            // 計算今天的字串格式
            const today = new Date();
            const todayStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
        
            // 對所有 date 欄位不等於 todayStr 的文件，一次更新
            const result = await regular.updateMany(
              { date: { $ne: todayStr } },
              {
                $set: {
                  date: todayStr,
                  "task.$[].completed": false
                }
              }
            );
        
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              message: 'Tasks reset successfully',
              modifiedCount: result.modifiedCount
            }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: error.message }));
          }
        });
      });
      
    router.put('/newlist-detail', async ({ req, res }) => {
      let body = '';
      req.on('data', chunk =>{
        body+=chunk.toString();
      })
      req.on('end', async () => {
        try {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          const { date, title, content } = JSON.parse(body);
          console.log(date, title, content);
          const existingDetail = await todayDetail.findOne({ date: date });
          console.log(existingDetail);
          if (existingDetail) {
            if(existingDetail.taskDetail.find(task => task.title === title)){
              await todayDetail.updateOne(
                { date: date, "taskDetail.title": title },
                { $set: { "taskDetail.$.content": content } }
              );
            }else{
              await todayDetail.updateOne(
                { date: date },
                { $push: { taskDetail: { title, content } } }
              );
            }
          } else {
            console.log(date, title, content);
            const newDetail = new todayDetail({ date: date, taskDetail: [{title, content}] });
            await newDetail.save();
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Task inserted successfully' }));
    }catch(error){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }})}
)
router.put('/regular-detail', async ({ req, res }) => {
  let body = '';
  req.on('data', chunk =>{
    body+=chunk.toString();
  })
  req.on('end', async () => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      const { date, title, content } = JSON.parse(body);
      console.log(date, title, content);
      const existingDetail = await todayDetail.findOne({ date: date });
      console.log(existingDetail);
      if (existingDetail) {
        if(existingDetail.taskDetail.find(task => task.title === title)){
          await todayDetail.updateOne(
            { date: date, "taskDetail.title": title },
            { $set: { "taskDetail.$.content": content } }
          );
        }else{
          await todayDetail.updateOne(
            { date: date },
            { $push: { taskDetail: { title, content } } }
          );
        }
      } else {
        console.log(date, title, content);
        const newDetail = new todayDetail({ date: date, taskDetail: [{title, content}] });
        await newDetail.save();
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Task inserted successfully' }));
}catch(error){
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
}})}
)
    router.get("/newlist", async({req, res}) => {
      try{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        const task = await today.find({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(task));
      }catch(error){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }})

    router.get("/newlist-detail", async({res}) => {
      try{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        const detail = await todayDetail.find({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(detail));
      }catch(error){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }})
    
    router.delete("/newlist", async ({ req, res }) => {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      
      req.on("end", async () => {
        try {
          // 正確設定 CORS 標頭
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
          const { date, task } = JSON.parse(body);
    
          const existingTask = await today.findOne({ date: date });
          if (existingTask) {
            // 過濾掉名稱等於 task 的項目
            existingTask.task = existingTask.task.filter(item => item.name !== task);
            // 若 task 陣列清空，刪除整筆文件；否則更新文件
            if (existingTask.task.length === 0) {
              await existingTask.deleteOne();
            } else {
              await existingTask.save();
            }
          }
    
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Task deleted successfully" }));
        } catch (error) {
          console.error(error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    });
    
    router.delete("/newlist-detail", async({req, res}) => {
      let body ="";
      req.on("data", chunk =>{body+=chunk.toString()}),
      
      req.on("end", async () =>{
            try{
              res.setHeader("Allow-Control-Access-Origin","*");
              res.setHeader("Allow-Control-Access-Methods","PUT, GET, POST, DELETE, OPTIONS");
              res.setHeader("Allow-Control-Access-Headers","Content-Type");
              const {date, task} = JSON.parse(body);
      console.log(task)
      const existingDetail = await todayDetail.findOne({date: date})
      if(existingDetail){
      existingDetail.taskDetail.find((item, index) =>{
      if(item.title === task){
        console.log(item.title)
      existingDetail.taskDetail.splice(index, 1)
      existingDetail.save()
      }})
      }else{
        return console.log("Details not found");
      }
      res.statusCode = 200;
      res.setHeader("Content-Type","application/json")
      res.end(JSON.stringify({message: "Task deleted successfully"}))
      }catch(error){console.error(error)}
      })}
    )
    router.delete("/remove-empty-newlist-detail", async({req, res}) => {
      let body ="";
      req.on("data", chunk =>{body+=chunk.toString()}),
      
      req.on("end", async () =>{
            try{
              res.setHeader("Allow-Control-Access-Origin","*");
              res.setHeader("Allow-Control-Access-Methods","PUT, GET, POST, DELETE, OPTIONS");
              res.setHeader("Allow-Control-Access-Headers","Content-Type");
    await todayDetail.deleteMany({ taskDetail: { $size: 0 } });
      res.statusCode = 200;
      res.setHeader("Content-Type","application/json")
      res.end(JSON.stringify({message: "Task deleted successfully"}))
      }catch(error){console.error(error)}
      })}
    )
    router.put("/newlist-changeName", async({req,res})=>{
      let body = "";  
      req.on("data", chunk =>{body+=chunk.toString()})
      req.on("end", async()=>{
        try{
          res.setHeader("Access-Control-Allow-Origin","*");
          res.setHeader("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type")
       const {date, taskTitle, newtitle} = JSON.parse(body);
       const existingTask = await today.findOne({date: date})
       console.log(existingTask)
       if(existingTask){
        await today.updateOne(
          { date: date, "task.name": taskTitle },
          { $set: { "task.$.name": newtitle } }
        );
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json")
        res.end(JSON.stringify({message: "Task renamed successfully"}))
       }
        }catch(error){console.error(error)}
      })
    })

    router.put("/regularlist-changeName", async({req,res})=>{
      let body = "";  
      req.on("data", chunk =>{body+=chunk.toString()})
      req.on("end", async()=>{
        try{
          res.setHeader("Access-Control-Allow-Origin","*");
          res.setHeader("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type")
       const {taskTitle, newtitle} = JSON.parse(body);
       const existingTask = await regular.findOne({"task.name": taskTitle})
       console.log(existingTask)
       if(existingTask){
        await regular.updateOne(
          { "task.name": taskTitle },
          { $set: { "task.$.name": newtitle } }
        );
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json")
        res.end(JSON.stringify({message: "Task renamed successfully"}))
       }
        }catch(error){console.error(error)}
      })
    })

// server.js – /regular PUT
router.put("/regular", async ({ req, res }) => {
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", async () => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      const { regularTask } = JSON.parse(body);        // <─ 用你新的名稱
      // regularTask 應該長這樣：[{ date:"27/3/2025", task:[…] }, …]
      const {date, task} = regularTask[0]
      console.log(date, task)
      const day = new Date();
      const yesterday =`${day.getDate() - 1}/${day.getMonth() + 1}/${day.getFullYear()}`;
      // 直接把你那筆日期的 task 改成傳來的 task
      await regular.updateOne(
        { date },
        { $set: { task: task } },  // 覆蓋整個陣列
        { upsert: true }
      );

      const latest = await regular.find({ date });            // 回傳最新內容
      res.end(JSON.stringify(latest));
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

    
      router.get("/regular", async({res})=>{
        try{
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
        res.setHeader("Access-Control-Allow-Header", "Content-Type")
        const data = await regular.find({})
        res.statusCode= 200;
        res.setHeader("Content-Type","application/json")
        res.end(JSON.stringify(data))
        }catch(err){
        console.error(err)
        }
      })
      router.put("/newlist-prioritize", async({req, res})=>{
let body = "";
req.on("data", (chunk)=>{
  body += chunk.toString();
})
req.on("end", async()=>{
  try{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, GET, DELETE, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type")
  const {task, date, priority} = JSON.parse(body);
  console.log(typeof(priority))
  const exist = await today.findOne({date: date})
  console.log(date, priority, task)
  if(exist){
    await today.updateOne(
      {date: date, "task.name": task},
      {$set:{"task.$.priority": priority}}
    )
  }
  res.statusCode = 200;
  res.setHeader("Content-Type","application/json")
  res.end(JSON.stringify({message: "Task prioritized successfully"}))
  }catch(error){
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message }));
    console.error(error)
  }
})
      })
      router.put("/regular-prioritize", async({req, res})=>{
        let body = "";
        req.on("data", (chunk)=>{
          body += chunk.toString();
        })
        req.on("end", async()=>{
          try{
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "PUT, GET, DELETE, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers","Content-Type")
          const {task, priority} = JSON.parse(body);
          const exist = await regular.find({})
          const existed = exist[0].task.find((item)=> item.name === task)
          if(existed){
            console.log(existed)
            exist[0].task.find((item)=> item.name === task).priority = priority;
            exist[0].markModified("task");
            await exist[0].save();
            console.log(`Task has been prioritized: ${task}`);
          }else {
            console.log(`Task has been updated: ${task}`);
            exist[0].task.push({ name: task, completed: false, priority: priority });
            exist[0].markModified("task");
            await exist[0].save();
          }
          console.log(existed)
          res.statusCode = 200;
          res.setHeader("Content-Type","application/json")
          res.end(JSON.stringify({message: "Task prioritized successfully"}))
          }catch(error){
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
            console.error(error)
          }
        })
      })
        router.delete("/regular", async({req, res})=>{
          let body = "";
          req.on("data", (chunk)=>{
            body += chunk.toString();
          })
          req.on("end", async () => {
            try {
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
              res.setHeader("Access-Control-Allow-Header", "Content-Type");
              const { task } = JSON.parse(body);
              console.log(task);
              const exists = await regular.findOne({});
              console.log(exists)
              if (exists) {
                exists.task.find((item, index)=>{
                  if(item.name === task){
                    exists.task.splice(index, 1)
                    exists.save()
                  }
                })
              }
res.statusCode = 200;
res.end(JSON.stringify({ message: "Task completed successfully" }))
} catch (error) {
  console.error(error);
  res.statusCode = 500;
  res.end(JSON.stringify({ error: error.message }));
}
})})

main();
