const router = require('express').Router();
const verify=require('./verifiyToken');
const connection=require('./server');
router.get('/articles',verify,(req,res)=>{
    let token = req.user;
    let arrArticles=[];
    
    let query =`select * from NyZaKa.Articles;`;
     connection.query(query,  async (error, results, fields)=> {
        if (error) res.send(error);
        //res.render('/Blogs'); 
        
        results.forEach(element => {
            let article={
                ID:element.ID,
                ArtName:element.ArtName,
                Topic:element.Topic,
                Statment:element.Statment,
                Art_date:element.Art_date.toLocaleDateString("en-US").split("-")
            }
            arrArticles.push(article);
        });
       // console.log(arrArticles);
        res.render('articles',{user:req.user, Current_Nav:'articles',articles:arrArticles});
    });
    
});
router.get('/article',verify,(req,res)=>{
    let token = req.user;
    
        res.render('article',{user:req.user, Current_Nav:'articles'});
    
    
});
router.get('/articles/:id',verify,(req,res)=>{
    let token = req.user;


    let query=`SELECT * FROM NyZaKa.Articles WHERE id=${req.params.id}`;
    console.log(req.params.id);
    connection.query(query,  (error, results, fields)=> {
        if (error) throw error;
        //res.render('/Blogs'); 
        console.log(results.length)
        if(!results.length)
            res.render('404',{user:req.user, Current_Nav:'__'});
        else
        {
            let article={
                ID:results[0].ID,
                ArtName:results[0].ArtName,
                Topic:results[0].Topic,
                Statment:results[0].Statment,
                Art_date:results[0].Art_date.toLocaleDateString("en-US").split("-")
            }
        
            res.render('article',{user:req.user, Current_Nav:'articles',article:article});
        }
    });



});
router.get('/createarticle',verify,(req,res)=>{
    let token = req.user;
    if(token.user.Acsess=="student"||!req.user)
        res.status(403).send("access denied");
    res.render('createarticle',{user:req.user, Current_Nav:'articles'});
});
router.post('/createarticle',verify,(req,res)=>{
    let token = req.user;
    if(token.user.Acsess=="student"||!req.user)
        res.status(403).send("access denied");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let article={
        name: req.body.title,
        Topic:req.body.Topic,
        body:req.body.body,
        date:year + "-" + month + "-" + date,
        writer:token.user.Handle
    };
    console.log(article);
    let query =`insert into NyZaKa.Articles(ArtName,Topic,Statment,Art_date,Writer) values("${article.name}","${article.Topic}","${article.body}","${article.date}","${article.writer}");`;
    connection.query(query,  async(error, results, fields)=> {
        if (error) res.send(error);
        //res.render('/Blogs'); 
        res.send("Articles added successfully");
    });
    //res.render('createarticle',{user:req.user, Current_Nav:'articles'});
});
module.exports = router;