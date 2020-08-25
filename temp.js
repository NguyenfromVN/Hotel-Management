function lol(){
    //add event listener for each row of the table, except the first row
    let rows=[];
    let tmp=document.getElementsByTagName('tr');
    for (let i=1; i<tmp.length; i++)
        rows.push(tmp[i]);
    for (let i=0; i<rows.length; i++)
        rows[i].addEventListener('click',function(){
            let caller=this;
            let tds=caller.getElementsByTagName('td');
            document.getElementById('updateRoom').style.display='inline-block';
            document.getElementById('deleteRoom').style.display='inline-block';
            //fill the form
            document.getElementById('id').textContent=caller.id;
            document.getElementById('name').value=tds[1].textContent;
            document.getElementById('type').value=tds[2].textContent;
            document.getElementById('note').value=tds[4].textContent;
            document.getElementById('status').textContent=tds[3].textContent;            
        })
    //add event for Buttons
    document.getElementById('addRoom').addEventListener('click',async function(){
        let ten=document.getElementById('name').value;
        let ghi_chu=document.getElementById('note').value;
        let loai_phong=document.getElementById('type').value;
        document.location='/update-room?mode=add&name='+ten+'&note='+ghi_chu+'&type='+loai_phong;       
    });
    document.getElementById('updateRoom').addEventListener('click',async function(){
        let id=document.getElementById('id').textContent;
        let ten=document.getElementById('name').value;
        let tinh_trang=document.getElementById('status').textContent;
        let ghi_chu=document.getElementById('note').value;
        let loai_phong=document.getElementById('type').value;
        document.location='/update-room?mode=upd&name='+ten+'&note='+ghi_chu+'&type='+loai_phong+'&id='+id+'&status='+tinh_trang;             
    });
    document.getElementById('deleteRoom').addEventListener('click',async function(){
        let id=document.getElementById('id').textContent;
        document.location='/update-room?mode=del&id='+id;         
    });                
}

function lol(){
    let noti=notification;
    noti=noti.replace(/br/g, "\\n");
    setTimeout(()=>alert('{{{notification}}}'),100);
}