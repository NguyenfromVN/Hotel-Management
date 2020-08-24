const htmlTemplate=
`<!DOCTYPE html>
<html>
    <head>
        <title>
            ROOMS
        </title>
        <style>
            body{
                margin: 0px;
            }
            #menu{
                display: flex;
            }
            #container{
                height: 100vh;
                display: grid;
                grid-template-rows: 5vh 95vh;
            }
            #contentPanel{
                box-sizing: border-box;
            }
            #roomsContent{
                display: grid;
                box-sizing: border-box;
                grid-template-columns: 1fr 1fr;
                height: 100%;
            }
            #searchRoom{
                display: grid;
                box-sizing: border-box;
                grid-template-columns: 1fr 1fr;
                height: 100%;
            }
            .scrollable{
                overflow: auto;
            }
            table {
                width:100%;
            }
            table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
            }
            th, td {
                padding: 15px;
                text-align: left;
            }
            tr:nth-child(even) {
                background-color: #eee;
            }
            tr:nth-child(odd) {
                background-color: #fff;
            }
            tr:hover{
                color: #ffffff;
                background-color: #000000;
            }
            th {
                background-color: black;
                color: white;
            }
            a {
                text-decoration: none;
            }
            #searchOptions{
                display: flex;
            }
        </style>
    </head>
    <body id="container">
        <!-- Menu -->
        <div id="menu">
            <button onclick="document.location='/rooms'">Rooms</button>
            <button onclick="document.location='/rent'">Rent</button>
            <button onclick="document.location='/search'">Search</button>
            <button>Bill</button>
            <button>Statistics</button>
            <button onclick="document.location='/logout'">Log out</button>
        </div>
        <div id="contentPanel">
            {{{contentPanel}}}
        </div>
        {{#each scripts}}
            <script src="{{this.src}}"></script>
        {{/each}}
    </body>    
</html>`
module.exports = {htmlTemplate};