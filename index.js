const http=require("http");
const fs=require("fs");
var requests=require("requests");

const homeFile=fs.readFileSync('home.html',"utf-8");

const replaceVal=(tempVal,orgValue)=>{
    let temperature=tempVal.replace("{%tempval%}",(orgValue.main.temp-273.15).toFixed(2));
    temperature=temperature.replace("{%tempmin%}",(orgValue.main.temp_min-273.15).toFixed(2));
    temperature=temperature.replace("{%tempmax%}",(orgValue.main.temp_max-273.15).toFixed(2));
    temperature=temperature.replace("{%location%}",orgValue.name);
    temperature=temperature.replace("{%country%}",orgValue.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgValue.weather[0].main);
    return temperature;
};
const server=http.createServer((req,res)=>{
    if (req.url="/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Kanpur&appid=0db1252d66838dce07d93dfe1407a22d"
        )
        .on("data",(chunk)=>{
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
            // console.log(arrData[0].main.temp);
            const realTimeData=arrData.map(val=> replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
        })
        .on("err",(err)=>{
            if(err) return console.log("connection closed due to errors",err);
            res.end();
        });
    }
    
});

server.listen(3000,'127.0.0.1');