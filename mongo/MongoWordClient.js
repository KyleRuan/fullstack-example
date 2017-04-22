/**
 * Created by KyleRuan on 2017/4/22.
 */
// 查询语句
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost/",function (err,db) {
  var myDB = db.db('words');
  myDB.collection('word_stats',findItems);
  setTimeout(function () {
    db.close();
  },3000);
});

function display(msg,cursor,pretty) {
  cursor.toArray(function (err,itemArr) {
    console.log("\n"+msg);
    var wordList = [];
    for (var i=0;i<itemArr.length;i++){
      wordList.push(itemArr[i].word);
    }
    console.log(JSON.stringify(wordList,null,pretty));
  })
}
var findItems = function (err,words) {
  words.find({first:{$in:['a','b','c']}},function (err,cursor) {
    display("words start with a,b,c",cursor);
  });
  words.find({size:{$gt:10}},function (err,cursor) {
    display("words letter >=10",cursor);
  });
// option {limit:10}
  // fields:{word:0}} 表示不返回word字段属性
  words.find({$and:[{size:{$gt:10}},{size:{$lt:12}}]},{limit:10,fields:{word:0}},
              function (err,cursor) {
                display("words letter >=10 <=12",cursor);
  });
  //有这么一个需求 ，就是做下一页的时候，客户端每次返回10条记录，
  // 下一页应该从上次查询之后再查10条
   words.find({size:{$gt:10}},
              {sort:{_id:1},limit:10,skip:0},
                function (err,cursor) {
                display("letters >10 limit 10 ,skip :0",cursor);
              });

  //
  words.find({size:{$gt:10}},
    {sort:{_id:1},limit:10,skip:0},
    function (err,cursor) {
      display("letters >10 limit 10 ,skip :0 again",cursor);
    });
// 不是从头再查  API设计的时候主要可以
  words.find({size:{$gt:10}},{sort:{_id:1},limit:10,skip:10},
  function (err,cursor) {
    display("letters >10 limit 10 ,skip :10",cursor);
  });

  // 如果为了查询集合中元素的个数 用count 比较快
  words.count({size:{$lt:5}},function (err,count) {
    console.log("letter < 5 count:"+count);
  });
  //查找特定的字段值
  words.distinct('word',{last:'u'},function (err,values) {
    console.log('\n word that last letter is u: ');
    console.log(values);
  });

  // 需求，比如统计一年级中各个年龄的人有多少个， 通过在reduce里面进行相应的增加。在finalize中统计总的
  // 最后再输出结果
  words.group(['first'],{size:{$gt:13}},
    {"count":0,'totalVowels':0,"consonants":0},function (obj,prev) {
      prev.count++;
      prev.totalVowels += obj.stats.vowels;
      prev.consonants += obj.stats.consonants;
    },function (obj) {
      // reduce 最好的结果
      obj.total = obj.totalVowels+obj.consonants;
    },true,function (err,results) {
      console.log("\n  words total");
      console.log(results)
    }
  );
  //按流的方式对查询结果进行处理
  //aggregate第一个参数是一系列的操作，先进行match进行查询，
  // 然后对查询结果进行分组，再对分组进行排序
  words.aggregate([{$match: {first:{$in:['a','e','i','o','u']}}},
    {$group:{_id:"$first",
             largest:{$max:"$size"},
              smallest:{$min:"$size"},
              toatal:{$sum:1}
    }},
    {$sort:{_id:1}}
  ],function (err,results) {
    console.log("\nLargest and smallest word sizes for"+ "words begin with a vowel");
    console.log(results);
  })
}


