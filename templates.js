// component for rooms page
const rooms=
`<div id="roomsContent">
    <div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
        <p>LIST OF ROOMS</p>
        <table>
            <tr>
                <th>No.</th>
                <th>Room</th> 
                <th>Type</th>
                <th>Status</th>
                <th>Note</th>
            </tr>
            {{#each rooms}}
                <tr id="{{this.id}}">
                    <td>{{this.stt}}</td>
                    <td>{{{this.ten}}}</td>
                    <td>{{this.ten_loai_phong}}</td>
                    <td>{{this.tinh_trang}}</td>
                    <td>{{{this.ghi_chu}}}</td>
                </tr>
            {{/each}}
        </table>
    </div>
    <div style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
        <p>ROOM DETAIL</p>
        <div>
            <p id="id" style="display: none;"></p>
            <p id="status" style="display: none;"></p>
            <p>Name:</p>
            <input type="text" id="name" name="name"><br><br>
            <p>Type of room ({{types}}):</p>
            <input type="text" id="type" name="type"><br><br>
            <p>Note:</p>
            <input type="text" id="note" name="note"><br><br>
        </div>
        <div id="buttons">
            <button id="addRoom">ADD</button>
            <button id="updateRoom" style="display: none;">UPDATE</button>
            <button id="deleteRoom" style="display: none;">DELETE</button>
        </div>
    </div>
</div>
{{#if notification}}
    <script>
        let params = (new URL(document.location)).searchParams;
        let noti = params.get("noti");
        setTimeout(()=>alert(noti),100);
    </script>
{{/if}}
<script>
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
</script>`;
const about=
`<div>
    <p>HOTEL MANAGEMENT SYSTEM</p>
    <P>version 1.0.0</P>
</div>`;
const rent=
`<div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
<p>LIST OF AVAILABLE ROOMS</p>
<p><b>Click to choose a room</b></p>
<table>
    <tr>
        <th>No.</th>
        <th>Room</th> 
        <th>Type</th>
        <th>Note</th>
    </tr>
    {{#each rooms}}
        <tr onclick="document.location='/rent-a-room?id={{this.id}}'">
            <td>{{this.stt}}</td>
            <td>{{{this.ten}}}</td>
            <td>{{this.ten_loai_phong}}</td>
            <td>{{{this.ghi_chu}}}</td>
        </tr>
    {{/each}}
</table>
</div>
{{#if notification}}
    <script>
        let params = (new URL(document.location)).searchParams;
        let noti = params.get("noti");
        setTimeout(()=>alert(noti),100);
    </script>
{{/if}}`;
const rentARoom=
`<div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
<p>RENTING INFORMATION</p>
<p>Room: {{room.ten}}</p>
<p>Type: {{type.ten}}</p>
<p>Price: {{type.don_gia}}</p>
<p>Note: {{room.ghi_chu}}</p>
<p>Start date: {{date}}</p>
<p><b>Input customers information below</b></p>
<form action="/rent-a-room?id={{room.id}}" method="post">
    <input style="display: none;" type="text" id="numberOfCustomers" name="numberOfCustomers" value="{{type.so_khach_toi_da}}">
    <input style="display: none;" type="text" id="startDate" name="startDate" value="{{date}}">
    {{#each nums}}
        <p><b>Customer {{this}}:</b></p>
        <p>Name:</p>
        <input type="text" id="name_{{this}}" name="name_{{this}}"><br><br>
        <p>Type ({{../types}}):</p>
        <input type="text" id="type_{{this}}" name="type_{{this}}"><br><br>
        <p>ID number:</p>
        <input type="text" id="id_{{this}}" name="id_{{this}}"><br><br>
        <p>Address:</p>
        <input type="text" id="addr_{{this}}" name="addr_{{this}}"><br><br>        
    {{/each}}
    <input type="submit" value="SUBMIT">
</form>   
</div>`;
const searchRoom=
`<div style="height: 100%; box-sizing: border-box; display: grid; grid-template-rows: 5% 95%;">
<div id="searchOptions">
    {{#each types}}
        <button onclick="document.location='/search?id={{this.id}}'">{{this.ten}}</button>        
    {{/each}}
</div>
<div id="searchRoom">
    <div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
        <p>LIST OF AVAILABLE ROOMS</p>
        <table>
            <tr>
                <th>No.</th>
                <th>Room</th> 
                <th>Type</th>
                <th>Price</th>
            </tr>
            {{#each avaiRooms}}
                <tr>
                    <td>{{this.stt}}</td>
                    <td>{{this.ten}}</td>
                    <td>{{this.ten_loai_phong}}</td>
                    <td>{{this.don_gia}}</td>
                </tr>
            {{/each}}
        </table>
    </div>
    <div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
        <p>LIST OF OCCUPIED ROOMS</p>
        <table>
            <tr>
                <th>No.</th>
                <th>Room</th> 
                <th>Type</th>
                <th>Price</th>
            </tr>
            {{#each occupiedRooms}}
                <tr>
                    <td>{{this.stt}}</td>
                    <td>{{this.ten}}</td>
                    <td>{{this.ten_loai_phong}}</td>
                    <td>{{this.don_gia}}</td>
                </tr>
            {{/each}}
        </table>
    </div>
</div>
</div>`;
const chooseRoom=
`<form action="/bill" method="get">
    <p>Enter room name:</p>
    <input type="text" id="name" name="name">      
</form>
{{#if notification}}
    <script>
        let params = (new URL(document.location)).searchParams;
        let noti = params.get("noti");
        setTimeout(()=>alert(noti),100);
    </script>
{{/if}}`;
const createBill=
`<div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
<form action="/create-bill" method="post">
    <p>BILL INFORMATION</p>
    <p>I. Customers information:</p>
    {{#each customers}}
        <p>Customer {{this.stt}}:</p>
        <p>Name: {{this.ho_ten}}</p>
        <p>Address: {{this.dia_chi}}</p>
    {{/each}}
    <p>II. Room information:</p>
    <p>Room: {{room.ten}}</p>
    <p>Type: {{type.ten}}</p>
    <p>Price: {{type.don_gia}} VND</p>
    <p>Number of days: {{days}}</p>
    <p>III. Total</p>
    <p>{{total}} VND</p>
    <input type="text" id="tri_gia" name="tri_gia" style="display: none;" value='{{total}}'>
    <input type="text" id="phieu_thue" name="phieu_thue" style="display: none;" value='{{phieuThueId}}'>
    <input type="text" id="ngay_lap" name="ngay_lap" style="display: none;" value='{{ngay_lap}}'>
    <input type="submit" value="CREATE BILL">
</form> 
</div>`;
const stat=
`<div id="stat">
<div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
    <p>Roms statistics in {{month}}</p>
    <table>
        <tr>
            <th>No.</th>
            <th>Type</th> 
            <th>Revenue</th>
            <th>Percentage</th>
        </tr>
        {{#each types}}
            <tr>
                <td>{{this.stt}}</td>
                <td>{{{this.ten}}}</td>
                <td>{{this.doanh_thu}}</td>
                <td>{{this.phan_tram}}</td>
            </tr>
        {{/each}}
    </table>
</div>
<div class="scrollable" style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
    <p>Usage frequency statistics in {{month}}</p>
    <table>
        <tr>
            <th>No.</th>
            <th>Room</th> 
            <th>Rent days</th>
            <th>Percentage</th>
        </tr>
        {{#each rooms}}
            <tr>
                <td>{{this.stt}}</td>
                <td>{{{this.ten}}}</td>
                <td>{{this.days}}</td>
                <td>{{this.phan_tram}}</td>
            </tr>
        {{/each}}
    </table>
</div>
</div>`;
const chooseMonth=
`<form action="/stat" method="get">
    <p>Enter month (from 1 to 12) to create Statistics:</p>
    <input type="text" id="month" name="month">      
</form>
{{#if notification}}
    <script>
        let params = (new URL(document.location)).searchParams;
        let noti = params.get("noti");
        setTimeout(()=>alert(noti),100);
    </script>
{{/if}}`;
module.exports={rooms,about,rent,rentARoom,searchRoom,chooseRoom,createBill,stat,chooseMonth};