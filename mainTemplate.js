const htmlTemplate=
`<!DOCTYPE html>
<html>
    <head>
        <title>
            Hotel Management
        </title>
        <style>
            button{
                border: 0px;
                padding-left: 50px;
                padding-right: 50px;
            }
            button:hover{
                color: #ffffff;
                background-color: #000000;
            }
            *{ 
                font-family: sans-serif;
            }
            body{
                margin: 0px;
            }
            #menu{
                display: flex;
                background-color: rgba(239,239,239);
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
                padding-left: 27vw;
            }
            #buttons{
                display: flex;
            }
            #stat{
                display: grid;
                box-sizing: border-box;
                grid-template-columns: 1fr 1fr;
                height: 100%;
            }
            #roomTypesContent{
                display: grid;
                box-sizing: border-box;
                grid-template-columns: 1fr 1fr;
                height: 100%;
            }
            #about{
                padding-left: 35vw;
                padding-top: 35vh;
            }
            #chooseMonth{
                padding-left: 35vw;
                padding-top: 35vh;
            }
            #chooseRoom{
                padding-left: 35vw;
                padding-top: 35vh;
            }
        </style>
    </head>
    <body id="container">
        <!-- Menu -->
        <div id="menu">
            <button onclick="document.location='/rooms'">Rooms</button>
            <button onclick="document.location='/rent'">Rent</button>
            <button onclick="document.location='/search'">Search</button>
            <button onclick="document.location='/bill'">Bill</button>
            <button onclick="document.location='/stat'">Statistics</button>
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