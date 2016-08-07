var http = require('http');
var url = require('url');
var util = require('util');
var querystring = require('querystring');

// var server = http.createServer(function(request, response){
//     var post = '';     //定义了一个post变量，用于暂存请求体的信息

//     request.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
//         post += chunk;
//     });

//     request.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
//         post = querystring.parse(post);
//         response.writeHead(200,{
//             "Content-Type":"text/plain",
//             "Access-Control-Allow-Origin":"*"
//         });
        
//         response.end();
//     });
    
    

// }).listen(3000);
var mongodb =require('mongodb');
var server = new mongodb.Server('localhost', 9999, {auto_reconnect:true});
var db = new mongodb.Db('test1', server, {safe:true});
db.open(function(err, db){
    if(!err){
        var collection1 = db.collection('collection1');
        var a = collection1.find().toArray();
        console.log(a);
        // toArray(function(e,docs){
        //      if(e) throw e ;
        //      console.log(docs) ;
        //  });

    }else{
        console.log(err);
    }
});

// var MongoClient = require('mongodb').MongoClient;
// var DB_CONN_STR = 'mongodb://localhost:9999/test1';    
// var insertData = function(db, callback) {  
//   //连接到表  
//   var collection = db.collection('collection1');
//   //插入数据
//   var data = [{"name":'wilson001',"age":21},{"name":'wilson002',"age":22}];
//   collection.insert(data, function(err, result) { 
//     if(err)
//     {
//       console.log('Error:'+ err);
//       return;
//     }    
//     callback(result);
//   });
// }
// MongoClient.connect(DB_CONN_STR, function(err, db) {
//     if(err){
//         console.log(err);
//     }
//         console.log(db);
//         console.log("连接成功！");
  
//   insertData(db, function(result) {
//     console.log(result);
//     db.close();
//   });
// });

