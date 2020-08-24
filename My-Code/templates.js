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
                <th>Note</th>
            </tr>
            {{#each rooms}}
                <tr>
                    <td>{{this.stt}}</td>
                    <td>{{{this.ten}}}</td>
                    <td>{{this.ten_loai_phong}}</td>
                    <td>{{{this.ghi_chu}}}</td>
                </tr>
            {{/each}}
        </table>
    </div>
    <div style="padding: 0px 5px 5px 5px; height: 100%; box-sizing: border-box;">
        <p>ADD NEW ROOM</p>
        <form action="/add-room" method="post">
            <p>Name:</p>
            <input type="text" id="name" name="name"><br><br>
            <p>Type of room ({{types}}):</p>
            <input type="text" id="type" name="type"><br><br>
            <p>Note:</p>
            <input type="text" id="note" name="note"><br><br>
            <input type="submit" value="SUBMIT">
        </form>
    </div>
</div>
{{#if notification}}
    <script>setTimeout(()=>alert('{{notification}}'),100);</script>
{{/if}}`;
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
    <script>setTimeout(()=>alert('{{notification}}'),100);</script>
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
module.exports={rooms,about,rent,rentARoom,searchRoom};