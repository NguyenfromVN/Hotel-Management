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
const hoa_donDBService=import_hoa_donDBService();
const templates=require('./templates.js');
const htmlTemplate2=require('./mainTemplate2.js');
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
            res.redirect('/manager');
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
                rooms[i].tinh_trang=(rooms[i].tinh_trang==0 ? 'Available' : 'Occupied');
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
app.get('/update-room', async function(req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let mode=req.query['mode'];
            if (mode=='add'){
                let notification='';
                let isOk=true;
                let ten=req.query['name'];
                let ghi_chu=req.query['note'];
                let loai_phong=await loai_phongDBService.getIdByName(req.query['type']);
                if (loai_phong===undefined)
                    isOk=false;
                else {
                    let room={ten,loai_phong,ghi_chu,tinh_trang:0};
                    //add new room
                    isOk=await phongDBService.addNewRoom(room);
                }
                if (isOk)
                    notification="New room was added successfully";
                else
                    notification="Please check the Name and the Type of room again:\n1. Name must be distinct\n2. Type must be valid";
                res.redirect('/rooms?noti='+notification);
            }
            if (mode=='del'){
                let notification='';
                let isOk=true;
                let id=parseInt(req.query['id']);
                isOk=await phongDBService.checkSafeDelete(id);
                if (isOk)
                    isOk=await phongDBService.deleteRoom(id);
                if (isOk)
                    notification='Deleted successfully';
                else
                    notification='The room is occupied, can not delete it';
                res.redirect('/rooms?noti='+notification);       
            }
            if (mode=='upd'){
                let notification='';
                let isOk=true;
                let id=parseInt(req.query['id']);
                let ten=req.query['name'];
                let tinh_trang=(req.query['status']=='Available' ? 0 : 1);
                let ghi_chu=req.query['note'];
                let loai_phong=await loai_phongDBService.getIdByName(req.query['type']);
                if (loai_phong===undefined)
                    isOk=false;
                else {
                    let room={id,ten,loai_phong,ghi_chu,tinh_trang};
                    //update room
                    isOk=await phongDBService.updateRoomById(room);
                }
                if (isOk)
                    notification='Updated successfully';
                else
                    notification='Please check the Name, the Type and the Status of room again:\n1. Name must be distinct\n2. Type must be valid\n3. Status must be Available';
                res.redirect('rooms?noti='+notification);       
            }
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/bill', async function(req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let roomName=req.query['name'];
            if (roomName===undefined){
                let notification=req.query['noti'];
                let html=htmlTemplate.htmlTemplate;
                let template=Handlebars.compile(html);
                let component=templates.chooseRoom;
                let template2=Handlebars.compile(component);
                let html2=template2({notification});
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
                //check roomName
                let room=await phongDBService.getRoomByName(roomName);
                if (room===undefined){
                    res.redirect(`/bill?noti=${'This room does not exist\nPlease check again'}`);
                } else {
                    if (room.tinh_trang==0){
                        res.redirect(`/bill?noti=${'This room is not being rented\nPlease check again'}`);
                    } else {
                        let html=htmlTemplate.htmlTemplate;
                        let template=Handlebars.compile(html);
                        let component=templates.createBill;
                        let template2=Handlebars.compile(component);
                        let phieu_thue_phong=await phieu_thue_phongDBService.getByRoomId(room.id);
                        let customersId=await khach_hang_phieu_thue_phongDBService.getByPhieuThueId(phieu_thue_phong.id);
                        let customers=await khach_hangDBService.getByIdList(customersId);
                        for (let i=0; i<customers.length; i++)
                            customers[i].stt=i+1;
                        let type=await loai_phongDBService.getTypeById(room.loai_phong);
                        let startDate=new Date(phieu_thue_phong.ngay_bat_dau);
                        let currentTime=new Date();
                        let days=currentTime.getDate()-startDate.getDate();
                        //calculate total
                        let total=type.don_gia;
                        for (let i=2; i<customers.length; i++){
                            total+=type.don_gia*type.ty_le_phu_thu;
                        }
                        let maxHeSo=1;
                        for (let i=0; i<customers.length; i++){
                            let tmp=await loai_khachDBService.getById(customers[i].loai);
                            maxHeSo=Math.max(maxHeSo,tmp.he_so);
                        }
                        total*=maxHeSo;
                        total*=days;
                        let ngay_lap=currentTime.getFullYear()+'-'+util.formatNumberForDateTime(currentTime.getMonth()+1)+'-'+util.formatNumberForDateTime(currentTime.getDate());
                        let html2=template2({customers,room,type,days,total,phieuThueId:phieu_thue_phong.id,ngay_lap});
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
                }
            }
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.post('/create-bill',async function(req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            //get data from body
            let tri_gia=parseInt(req.body.tri_gia);
            let phieu_thue=parseInt(req.body.phieu_thue);
            let ngay_lap=req.body.ngay_lap;
            let tmp=await phieu_thue_phongDBService.getById(phieu_thue);
            let notification='';
            let isOk=(await hoa_donDBService.addNew(tri_gia,phieu_thue,ngay_lap) && phongDBService.updateStatus(tmp.phong, 0));       
            if (isOk)
                notification="Created successfully";
            else
                notification="Something went wrong with the DB. Please check DB log for more details";
            res.redirect('/bill?noti='+notification);                          
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/stat', async function (req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level!=1)
            res.redirect('/');
        else {
            let month=req.query['month'];
            let notification=req.query['noti'];
            if (month===undefined){
                let html=htmlTemplate.htmlTemplate;
                let template=Handlebars.compile(html);
                let component=templates.chooseMonth;
                let template2=Handlebars.compile(component);
                let html2=template2({notification});
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
                let currentTime=new Date();
                if (parseInt(month)<currentTime.getMonth()+1){
                    let html=htmlTemplate.htmlTemplate;
                    let template=Handlebars.compile(html);
                    let component=templates.stat;
                    let template2=Handlebars.compile(component);
                    let types=await loai_phongDBService.getAllTypes();
                    let total=0;
                    for (let i=0; i<types.length; i++){
                        types[i].stt=i+1;
                        let doanh_thu=await hoa_donDBService.getTotalByRoomType(types[i].id,month);
                        total+=doanh_thu;
                        types[i].doanh_thu=doanh_thu;
                    }
                    for (let i=0; i<types.length; i++){
                        types[i].phan_tram=(types[i].doanh_thu>0 ? types[i].doanh_thu*100/total : 0);
                    }
                    let rooms=await phongDBService.getAllRooms();
                    for (let i=0; i<rooms.length; i++){
                        rooms[i].stt=i+1;
                        rooms[i].days=await phieu_thue_phongDBService.countDays(rooms[i].id,month);
                        rooms[i].phan_tram=rooms[i].days/30*100;
                    }
                    let tmp=['','January','February','March','April','May','June','July','August','September','October','November','December'];
                    let html2=template2({month:tmp[parseInt(month)],types,rooms});
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
                    notification='Month to create Statistics is smaller than the current month. Please input a valid month';
                    res.redirect(`/stat?noti=${notification}`);
                }
            }
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/manager',async function (req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level==1)
            res.redirect('/');
        else {
            //return manager's screen
            let html=htmlTemplate2.htmlTemplate;
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
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/manager/room-type',async function(req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level==1)
            res.redirect('/');
        else {
            let mode=req.query['mode'];
            if (mode===undefined){
                let notification=req.query['noti'];
                let html=htmlTemplate2.htmlTemplate;
                let template=Handlebars.compile(html);
                let component=templates.roomTypeManage;
                //create content for component
                let types=await loai_phongDBService.getAllTypes();
                for (let i=0; i<types.length; i++)
                    types[i].stt=i+1;
                let template2=Handlebars.compile(component);
                let html2=template2({notification,types});
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
            } else if (mode=='add'){
                //get data
                let ten=req.query['name'];
                let don_gia=req.query['price'];
                let so_khach_toi_da=req.query['max'];
                let ty_le_phu_thu=req.query['extra'];
                //check name is unique or not
                let isOk=await loai_phongDBService.checkUniqueName(ten);
                if (isOk)
                    isOk=await loai_phongDBService.addNew({ten,don_gia,so_khach_toi_da,ty_le_phu_thu});
                if (!isOk){
                    let notification='This room type name is already exists';
                    res.redirect('/manager/room-type?noti='+notification);
                } else {
                    let notification='Added new room type successfully';
                    res.redirect('/manager/room-type?noti='+notification);
                }
            } else if (mode=='upd'){
                //get data
                let id=req.query['id'];
                let ten=req.query['name'];
                let don_gia=req.query['price'];
                let so_khach_toi_da=req.query['max'];
                let ty_le_phu_thu=req.query['extra'];
                //check name is unique or not
                let isOk=await loai_phongDBService.checkUniqueNameForUpdate(id,ten);
                if (isOk)
                    isOk=await loai_phongDBService.update({id,ten,don_gia,so_khach_toi_da,ty_le_phu_thu});
                if (!isOk){
                    let notification='This room type name is already exists';
                    res.redirect('/manager/room-type?noti='+notification);
                } else {
                    let notification='Updated room type successfully';
                    res.redirect('/manager/room-type?noti='+notification);
                }
            }
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.get('/manager/customer-type',async function(req, res){
    if (util.validateCookie(req.cookies.id)){
        let level=util.getUserLevel(arr,req.cookies.id);
        if (level==1)
            res.redirect('/');
        else {
            let mode=req.query['mode'];
            if (mode===undefined){
                let notification=req.query['noti'];
                let html=htmlTemplate2.htmlTemplate;
                let template=Handlebars.compile(html);
                let component=templates.customTypeManage;
                //create content for component
                let types=await loai_khachDBService.getAllTypes();
                for (let i=0; i<types.length; i++)
                    types[i].stt=i+1;
                let template2=Handlebars.compile(component);
                let html2=template2({notification,types});
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
            } else if (mode=='add'){
                //get data
                let ten=req.query['name'];
                let he_so=req.query['coef'];
                //check name is unique or not
                let isOk=await loai_khachDBService.checkUniqueName(ten);
                if (isOk)
                    isOk=await loai_khachDBService.addNew({ten,he_so});
                if (!isOk){
                    let notification='This customer type name is already exists';
                    res.redirect('/manager/customer-type?noti='+notification);
                } else {
                    let notification='Added new customer type successfully';
                    res.redirect('/manager/customer-type?noti='+notification);
                }
            } else if (mode=='upd'){
                //get data
                let id=req.query['id'];
                let ten=req.query['name'];
                let he_so=req.query['coef'];
                //check name is unique or not
                let isOk=await loai_khachDBService.checkUniqueNameForUpdate(id,ten);
                if (isOk)
                    isOk=await loai_khachDBService.update({id,ten,he_so});
                if (!isOk){
                    let notification='This customer type name is already exists';
                    res.redirect('/manager/customer-type?noti='+notification);
                } else {
                    let notification='Updated customer type successfully';
                    res.redirect('/manager/customer-type?noti='+notification);
                }
            }
        }
    } else {
        util.removeElement(arr,req.cookies.id);
        res.clearCookie('id');
        res.redirect('/login');
    }
})
app.use('/',function(req, res){
    res.send(`
    <div style="height: 100%; display:flex; justify-content: center; align-items: center">
        <b style="font-size:40px">
            404<br>Page Not Found
        </b>
    </div>
    `);
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
    async function updateRoomById(room){
        room.id=parseInt(room.id);
        room.tinh_trang=parseInt(room.tinh_trang);
        room.loai_phong=parseInt(room.loai_phong);
        //check ten, loai_phong and tinh_trang
        let arr=await getAllRooms();
        for (let i=0; i<arr.length; i++) 
            if (arr[i].ten==room.ten && arr[i].id!=room.id)
                return false;
        let type=await loai_phongDBService.getTypeById(room.loai_phong);
        if (type===undefined)
            return false;
        if (room.tinh_trang!=0)
            return false;
        try {
            await db.update('phong','id',room);
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
    async function getRoomByName(name){
        let arr=await getAllRooms();
        for (let i=0; i<arr.length; i++)
            if (arr[i].ten==name)
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
    async function checkSafeDelete(id){
        let arr=await phieu_thue_phongDBService.getAll();
        for (let i=0; i<arr.length; i++)
            if (arr[i].phong==id)
                return false;
        return true;
    }
    async function deleteRoom(id){
        try {
            await db.del('phong','id',id);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    return {getAllRooms,addNewRoom,getAvailableRooms,getRoomById,updateStatus,getRoomsByType,updateRoomById,checkSafeDelete,deleteRoom,getRoomByName};
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
    async function getTypeByName(name){
        let arr=await getAllTypes();
        for (let i=0; i<arr.length; i++)
            if (arr[i].ten==name)
                return arr[i];
    }
    async function checkUniqueName(name){
        let tmp=await getTypeByName(name);
        if (tmp===undefined)
            return true;
        return false;
    }
    async function addNew(type){
        if (await getTypeByName(type.ten))
            return false;
        try {
            await db.create('loai_phong',type);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    async function checkUniqueNameForUpdate(id,name){
        let arr=await getAllTypes();
        for (let i=0; i<arr.length; i++)
            if (arr[i].id!=id)
                if (arr[i].ten==name)
                    return false;
        return true;
    }
    async function update(type){
        type.id=parseInt(type.id);
        type.don_gia=parseInt(type.don_gia);
        type.so_khach_toi_da=parseInt(type.so_khach_toi_da);
        type.ty_le_phu_thu=parseFloat(type.ty_le_phu_thu);
        try {
            await db.update('loai_phong','id',type);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    return {getAllTypes,getIdByName,getTypeById,getTypeByName,checkUniqueName,addNew,checkUniqueNameForUpdate,update};
}
//file loai_khachDBService.js ================================================================
function import_loai_khachDBService(){
    async function getAllTypes() {
        let sql='select * from loai_khach';
        let arr=await db.read(sql);
        return arr;       
    }
    async function getById(id) {
        let arr=await getAllTypes();
        for (let i=0; i<arr.length; i++)
            if (arr[i].id==id)
                return arr[i];
    }
    async function checkUniqueName(name){
        let arr=await getAllTypes();
        for (let i=0; i<arr.length; i++)
            if (arr[i].ten==name)
                return false;
        return true;
    }
    async function addNew(type){
        type.he_so=parseFloat(type.he_so);
        try {
            await db.create('loai_khach',type);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    async function checkUniqueNameForUpdate(id,name){
        let arr=await getAllTypes();
        for (let i=0; i<arr.length; i++)
            if (arr[i].id!=id)
                if (arr[i].ten==name)
                    return false;
        return true;
    }
    async function update(type){
        type.id=parseInt(type.id);
        type.he_so=parseFloat(type.he_so);
        try {
            await db.update('loai_khach','id',type);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    return {getAllTypes,getById,checkUniqueName,addNew,checkUniqueNameForUpdate,update};
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
    async function getByIdList(list){
        let arr=await getAll();
        let res=[];
        for (let i=0; i<arr.length; i++){
            let chk=false;
            for (let j=0; j<list.length; j++)
                if (list[j]==arr[i].cmnd)
                    chk=true;
            if (chk)
                res.push(arr[i]);
        }
        return res;
    }
    return {getAll,getCustomerByName,getCustomerById,addNew,getByIdList};
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
    async function getByRoomId(id){
        let arr=await getAll();
        let maxDate=new Date(0);
        let res=undefined;
        for (let i=0; i<arr.length; i++)
            if (arr[i].phong==id){
                if (new Date(arr[i].ngay_bat_dau)>maxDate)
                    maxDate=new Date(arr[i].ngay_bat_dau);
                if ((new Date(arr[i].ngay_bat_dau)).getTime()===maxDate.getTime())
                    res=arr[i];
            }
        return res;
    }
    async function getById(id){
        let arr=await getAll();
        for (let i=0; i<arr.length; i++)
            if (arr[i].id==id)
                return arr[i];
    }
    async function countDays(roomId,month){
        let arr=await getAll();
        let res=0;
        for (let i=0; i<arr.length; i++){
            if (arr[i].phong==roomId && (new Date(arr[i].ngay_bat_dau)).getMonth()+1==month){
                //get hoa_don
                let hoa_don=await hoa_donDBService.getByPhieuThueId(arr[i].id);
                if (hoa_don===undefined)
                    res+=31-(new Date(arr[i].ngay_bat_dau)).getDate();
                else if ((new Date(hoa_don.ngay_lap)).getMonth()+1!=month)
                    res+=31-(new Date(arr[i].ngay_bat_dau)).getDate();
                else
                    res+=(new Date(hoa_don.ngay_lap)).getDate()-(new Date(arr[i].ngay_bat_dau)).getDate()+1;                    
            }
        }
            
        return res;
    }
    return {addNew,getAll,find,getByRoomId,getById,countDays};
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
    async function getByPhieuThueId(id){
        let arr=await getAll();
        let ans=[];
        for (let i=0; i<arr.length; i++)
            if (arr[i].phieu_thue==id)
                ans.push(arr[i].khach_hang);
        return ans;
    }
    async function getAll(){
        let sql='select * from khach_hang_phieu_thue_phong';
        let arr=await db.read(sql);
        return arr;   
    }
    return {addNew,getByPhieuThueId,getAll};
}
function import_hoa_donDBService(){
    async function addNew(tri_gia,phieu_thue,ngay_lap){
        try {
            await db.create('hoa_don',{tri_gia,phieu_thue,ngay_lap});
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
    async function getAll(){
        let sql='select * from hoa_don';
        let arr=await db.read(sql);
        return arr;   
    }
    async function getTotalByRoomType(typeId,month){
        let res=0;
        let arr=await getAll();
        for (let i=0; i<arr.length; i++)
            if ((new Date(arr[i].ngay_lap)).getMonth()+1==month){
                let phieu_thue_phong=await phieu_thue_phongDBService.getById(arr[i].phieu_thue);
                let phong=await phongDBService.getRoomById(phieu_thue_phong.phong);
                if (phong.loai_phong==typeId)
                    res+=arr[i].tri_gia;
            }
        return res;
    }
    async function getByPhieuThueId(id){
        let arr=await getAll();
        for (let i=0; i<arr.length; i++)
            if (arr[i].phieu_thue==id)
                return arr[i];
    }
    return {addNew,getAll,getTotalByRoomType,getByPhieuThueId};
}

const port = 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));