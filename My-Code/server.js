const express=require('express');
const app=express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const Handlebars = require("handlebars");

//import from another files
const util=import_util();
const matkhauDBService=import_matkhauDBService();
const db=import_db();
const phongDBService=import_phongDBService();
const loai_phongDBService=import_loai_phongDBService();
const loai_khachDBService=import_loai_khachDBService();
const khach_hangDBService=import_khach_hangDBService();
const phieu_thue_phongDBService=import_phieu_thue_phongDBService();
const khach_hang_phieu_thue_phongDBService=import_khach_hang_phieu_thue_phongDBService();
const templates=require('./templates.js');
const htmlTemplate=require('./mainTemplate');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

let arr=[];

app.get('/', function(req, res) {
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level==1){
            //return staff's screen
            let html=htmlTemplate.htmlTemplate;
            let template=Handlebars.compile(html);
            let aboutComponent=templates.about;
            let html2=aboutComponent;
            html=template({contentPanel:html2});
            let dummy='';
            for (let i=0; i<100; i++)
                dummy+=' ';
            html+=dummy;
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': html.length,
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(html);
        } else {
            res.send('not done yet!');
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }   
})
app.get('/logout', function(req, res) {
    //logout and redirect to login page
    util.removeElement(arr,req.cookies.id);
    res.clearCookie('id');
    res.redirect('/login');
})
app.post('/login', async function(req, res) {
    //post login
    //validate user's password
    if (await matkhauDBService.validatePassword(req.body.pwd)){
        let num=(Math.random()*1000000000000000000000)+'-'+(Math.random()*1000000000000000000000);
        let level=await matkhauDBService.getLevel(req.body.pwd);
        res.cookie('id',num);
        arr.push({cookie:num,level});
        res.redirect('/');
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }         
})
app.get('/login', function(req, res) {
    //get login page
    if (util.validateCookie(req.cookies.id))
        res.redirect('/');
    else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.sendFile('./public/login.html', {root: __dirname });
    }        
})
app.get('/rooms', async function(req, res) {
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let notification=req.query['noti'];
            let html=htmlTemplate.htmlTemplate;
            let template=Handlebars.compile(html);
            let roomsComponent=templates.rooms;
            //create content for component
            let rooms=await phongDBService.getAllRooms();
            for (let i=0; i<rooms.length; i++){
                let type=await loai_phongDBService.getTypeById(rooms[i].loai_phong);
                rooms[i].stt=i+1;
                rooms[i].ten_loai_phong=type.ten;
            }                
            let template2=Handlebars.compile(roomsComponent);
            let types=await loai_phongDBService.getAllTypes();
            let tmp=''+types[0].ten;
            for (let i=1; i<types.length; i++)
                tmp+=', '+types[i].ten;
            types=tmp;
            let html2=template2({rooms,types,notification});
            html=template({contentPanel:html2});
            let dummy='';
            for (let i=0; i<100; i++)
                dummy+=' ';
            html+=dummy;
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': html.length,
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(html);
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.post('/add-room', async function(req,res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            //get body from POST messages
            let type=await loai_phongDBService.getIdByName(req.body.type);
            if (type===undefined)
                isOk=false;
            else {
                let room={ten:req.body.name,loai_phong:type,ghi_chu:req.body.note,tinh_trang:0};
                //add new room
                isOk=await phongDBService.addNewRoom(room);
            }
            let notification='';
            if (isOk)
                notification=`New room was added successfully`;
            else
                notification=`Please check the Name and the Type of room again: Name must be distinct and Type must be valid`;
            res.redirect(`/rooms?noti=${notification}`);
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/rent',async function (req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let notification=req.query['noti'];
            let html=htmlTemplate.htmlTemplate;
            let template=Handlebars.compile(html);
            let component=templates.rent;
            //create content for component
            let rooms=await phongDBService.getAvailableRooms();
            for (let i=0; i<rooms.length; i++){
                rooms[i].stt=i+1;
                let type=await loai_phongDBService.getTypeById(rooms[i].loai_phong);
                rooms[i].ten_loai_phong=type.ten;
            }
            let template2=Handlebars.compile(component);
            let html2=template2({rooms,notification});
            html=template({contentPanel:html2});
            let dummy='';
            for (let i=0; i<100; i++)
                dummy+=' ';
            html+=dummy;
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': html.length,
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(html);
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/rent-a-room',async function(req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let html=htmlTemplate.htmlTemplate;
            let template=Handlebars.compile(html);
            let component=templates.rentARoom;
            //create content for component
            let room=await phongDBService.getRoomById(req.query['id']);
            let type=await loai_phongDBService.getTypeById(room.loai_phong);
            let nums=[];
            for (let i=0; i<type.so_khach_toi_da; i++)
                nums.push(i+1);
            let arr=await loai_khachDBService.getAllTypes();
            let types=''+arr[0].id+' for "'+arr[0].ten+'"';
            for (i=1; i<arr.length; i++)
                types+=', '+arr[i].id+' for "'+arr[i].ten+'"';
            let currentTime=new Date();
            let date=util.formatNumberForDateTime(currentTime.getDate())+'-'+util.formatNumberForDateTime(currentTime.getMonth()+1)+'-'+currentTime.getFullYear();
            let template2=Handlebars.compile(component);
            let html2=template2({room,type,nums,types,date});
            html=template({contentPanel:html2});
            let dummy='';
            for (let i=0; i<100; i++)
                dummy+=' ';
            html+=dummy;
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': html.length,
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(html);
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.post('/rent-a-room',async function(req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let room=await phongDBService.getRoomById(req.query['id']);
            let numberOfCustomers=req.body.numberOfCustomers;
            let currentTime=new Date();
            let startDate=currentTime.getFullYear()+'-'+util.formatNumberForDateTime(currentTime.getMonth()+1)+'-'+util.formatNumberForDateTime(currentTime.getDate());
            let customers=[];
            for (let i=1; i<=numberOfCustomers; i++)
                if (req.body[`name_${i}`]!=''){
                    let customer={};
                    customer.cmnd=req.body[`id_${i}`];
                    customer.ho_ten=req.body[`name_${i}`];
                    customer.loai=req.body[`type_${i}`];
                    customer.dia_chi=req.body[`addr_${i}`];
                    customers.push(customer);
                }
            //validate customers information
            let isOk=true;
            for (let i=0; i<customers.length; i++){
                let customer=await khach_hangDBService.getCustomerById(customers[i].cmnd);
                if (customer===undefined)
                    await khach_hangDBService.addNew(customers[i]);
                else if (customer.ho_ten!=customers[i].ho_ten)
                    isOk=false;
                else if (customer.loai!=customers[i].loai)
                    isOk=false;
                else if (customer.dia_chi!=customers[i].dia_chi)
                    isOk=false;
            }
            let notification='';
            if (!isOk)
                notification="Information of customers is not identical with the data in DB";
            else
                notification="Create rental slip successfully";
            if (isOk){
                //update DB
                await phongDBService.updateStatus(room.id,1);
                await phieu_thue_phongDBService.addNew(startDate,room.id);
                let slipId=await phieu_thue_phongDBService.find(startDate,room.id);
                slipId=slipId.id;
                for (let i=0; i<customers.length; i++){
                    await khach_hang_phieu_thue_phongDBService.addNew(customers[i].cmnd,slipId);
                }    
            }
            res.redirect(`/rent?noti=${notification}`);
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/search',async function (req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let html=htmlTemplate.htmlTemplate;
            let template=Handlebars.compile(html);
            let component=templates.searchRoom;
            //create content for component
            let types=await loai_phongDBService.getAllTypes();
            let typeId=req.query['id'];
            let avaiRooms=[];
            let occupiedRooms=[];
            if (typeId!==undefined){
                let rooms=await phongDBService.getRoomsByType(typeId);
                let type=await loai_phongDBService.getTypeById(typeId);
                for (let i=0; i<rooms.length; i++)
                    if (rooms[i].tinh_trang==0){
                        rooms[i].stt=avaiRooms.length+1;
                        rooms[i].ten_loai_phong=type.ten;
                        rooms[i].don_gia=type.don_gia;
                        avaiRooms.push(rooms[i]);
                    } else {
                        rooms[i].stt=occupiedRooms.length+1;
                        rooms[i].ten_loai_phong=type.ten;
                        rooms[i].don_gia=type.don_gia;
                        occupiedRooms.push(rooms[i]);
                    }
            }
            let template2=Handlebars.compile(component);
            let html2=template2({types,avaiRooms,occupiedRooms});
            html=template({contentPanel:html2});
            let dummy='';
            for (let i=0; i<100; i++)
                dummy+=' ';
            html+=dummy;
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': html.length,
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(html);
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})


//file utils.js ==============================================================================
function import_util(){
    function validateCookie(userCookie){
        //validate user's cookie
        if (userCookie === undefined)
            return false;
        for (let i=0; i<arr.length; i++)
            if (arr[i].cookie==userCookie)
                return true;
        return false;
    }
    function removeElement(arr, cookie){
        if (cookie===undefined)
            return;
        for (let i=0; i<arr.length; i++)
            if (arr[i].cookie==cookie){
                let tmp=arr[i];
                arr[i]=arr[arr.length-1];
                arr[arr.length-1]=tmp;
            }
        arr.pop();
    }
    function getUserLevel(arr, cookie){
        for (let i=0; i<arr.length; i++)
            if (arr[i].cookie===cookie)
                return arr[i].level;
    }
    function formatNumberForDateTime(digit){
        return (digit<10 ? '0'+digit : digit);
    }
    return {validateCookie,removeElement,getUserLevel,formatNumberForDateTime};
}
//file matkhauDBService.js ===================================================================
function import_matkhauDBService(){
    async function validatePassword(password) {
        let sql='select * from mat_khau';
        let arr=await db.read(sql);
        let hashPassword=password;
        for (let i=0; i<arr.length; i++)
            if (arr[i].hash_mat_khau==hashPassword)
                return true;
        return false;       
    }
    async function getLevel(password) {
        let sql='select * from mat_khau';
        let arr=await db.read(sql);
        let hashPassword=password;
        for (let i=0; i<arr.length; i++)
            if (arr[i].hash_mat_khau==hashPassword)
                return arr[i].cap_bac;       
    }
    return {validatePassword,getLevel};
}
//file db.js =================================================================================
function import_db(){
    const mysql = require("mysql");
    function createConnection() {
        return mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "hoteldb"
        });
    }
    function read(sql){
        return new Promise((resolve, reject) => {
            const con = createConnection();
            con.connect(err => {
                if (err) {
                    reject(err);
                }
            });
            con.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else 
                    resolve(results);
            });
            con.end();
        });
    };
    function create(tbName, entity){
        return new Promise((resolve, reject) => {
            const con = createConnection();
            con.connect(err => {
                if (err) {
                    reject(err);
                }
            });
            const sql = `INSERT INTO ${tbName} SET ?`;
            con.query(sql, entity, (error, results, fields) => {
                if (error) 
                    reject(error);
                else 
                    resolve(results);
            });
            con.end();
        });
    };
    function del(tbName, idField, id){
        return new Promise((resolve, reject) => {
            const con = createConnection();
            con.connect(err => {
                if (err) 
                    reject(err);
            });
            let sql = `DELETE FROM ?? WHERE ?? = ?`;
            const params = [tbName, idField, id];
            sql = mysql.format(sql, params);
            con.query(sql, (error, results, fields) => {
                if (error) 
                    reject(error);
                else 
                    resolve(results);
            });
            con.end();
        });
    };
    function update(tbName, idField, entity){
        return new Promise((resolve, reject) => {
            const con = createConnection();
            con.connect(err => {
                if (err) 
                    reject(err);
            });
            const id = entity[idField];
            delete entity[idField];
            //db.update('phong','id',room);
            let sql = `UPDATE ${tbName} SET ? WHERE ${idField} = "${id}"`;
            sql = mysql.format(sql, entity);
            con.query(sql, (error, results, fields) => {
                if (error) 
                    reject(error);
                else 
                    resolve(results);
            });
            con.end();
        });
    };
    return {create,read,update,del};
}
//file phongDBService.js =====================================================================
function import_phongDBService(){
    async function getAllRooms() {
        let sql='select * from phong';
        let arr=await db.read(sql);
        return arr;       
    }
    async function addNewRoom(room){
        let arr=await getAllRooms();
        for (let i=0; i<arr.length; i++)
            if (arr[i].ten==room.ten)
                return false;
        try {
            await db.create('phong',room);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    async function getAvailableRooms(){
        let arr=await getAllRooms();
        let newArr=[];
        for (let i=0; i<arr.length; i++)
            if (arr[i].tinh_trang==0)
                newArr.push(arr[i]);
        return newArr;
    }
    async function getRoomById(id){
        let arr=await getAllRooms();
        for (let i=0; i<arr.length; i++)
            if (arr[i].id==id)
                return arr[i];
    }
    async function updateStatus(roomId,status){
        let room=await getRoomById(roomId);
        room.tinh_trang=status;
        try {
            await db.update('phong','id',room);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    async function getRoomsByType(id){
        let arr=await getAllRooms();
        let newArr=[];
        for (let i=0; i<arr.length; i++)
            if (arr[i].loai_phong==id)
                newArr.push(arr[i]);
        return newArr;
    }
    return {getAllRooms,addNewRoom,getAvailableRooms,getRoomById,updateStatus,getRoomsByType};
}
//file loai_phongDBService.js ================================================================
function import_loai_phongDBService(){
    async function getAllTypes() {
        let sql='select * from loai_phong';
        let arr=await db.read(sql);
        return arr;       
    }
    async function getIdByName(name){
        let arr=await getAllTypes();
        for (let i=0; i<arr.length; i++)
            if (arr[i].ten==name)
                return parseInt(arr[i].id);
    }
    async function getTypeById(id){
        let arr=await getAllTypes();
        for (let i=0; i<arr.length; i++)
            if (arr[i].id==id)
                return arr[i];
    }
    return {getAllTypes,getIdByName,getTypeById};
}
//file loai_khachDBService.js ================================================================
function import_loai_khachDBService(){
    async function getAllTypes() {
        let sql='select * from loai_khach';
        let arr=await db.read(sql);
        return arr;       
    }
    return {getAllTypes};
}
//file khach_hangDBService.js ================================================================
function import_khach_hangDBService(){
    async function getAll() {
        let sql='select * from khach_hang';
        let arr=await db.read(sql);
        return arr;       
    }
    async function getCustomerByName(name) {
        let arr=await getAll();
        for (let i=0; i<arr.length; i++)
            if (arr[i].ho_ten==name)
                return arr[i];
    }
    async function getCustomerById(id) {
        let arr=await getAll();
        for (let i=0; i<arr.length; i++)
            if (arr[i].cmnd==id)
                return arr[i];
    }
    async function addNew(customer){
        if (await getCustomerById(customer.id))
            return false;
        try {
            await db.create('khach_hang',customer);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    return {getAll,getCustomerByName,getCustomerById,addNew};
}
//file phieu_thue_phongDBService.js ==========================================================
function import_phieu_thue_phongDBService(){
    async function getAll() {
        let sql='select * from phieu_thue_phong';
        let arr=await db.read(sql);
        return arr;       
    }
    async function addNew(date,roomId){
        try {
            await db.create('phieu_thue_phong',{ngay_bat_dau:date,phong:roomId});
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    async function find(date,roomId){
        let arr=await getAll();
        let res=undefined;
        for (let i=0; i<arr.length; i++)
            if (''+(new Date(date+'T00:00:00'))==''+(new Date(arr[i].ngay_bat_dau)) && roomId==arr[i].phong)
                res=arr[i];
        return res;
    }
    return {addNew,getAll,find};
}
//file khach_hang_phieu_thue_phongDBService.js ===============================================
function import_khach_hang_phieu_thue_phongDBService(){
    async function addNew(customerId,slipId){
        try {
            await db.create('khach_hang_phieu_thue_phong',{khach_hang:customerId,phieu_thue:slipId});
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    return {addNew};
}

const port = 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));