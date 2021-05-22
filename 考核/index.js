window.onload = send_ajax();        //在页面加载完成后，默认发送ajax请求，更新本地数据

// 统一获取将要用到的元素，部分元素设为全局变量，以便后续在部分函数中使用

var search = document.querySelector("#search");             //搜索栏
var ct_hot = document.querySelector(".ct-hot-city");        //获取历史记录，热门城市总览
var btn_cancel = document.querySelector(".btn-cancel");     //获取取消按钮
var hist = document.querySelector(".ct-history");           //获取历史记录版块
var input = document.querySelector(".ct-input input");      //获取搜索用的input框
var ct_list = document.querySelector(".city-list");         //获取搜索时的地区展示栏
var hot = ct_hot.children[2].children;                      //获取热门城市版块
var ct_name;
var cover2 = document.querySelector(".cover2");             //获取上方的遮罩层
var cover = document.querySelector(".cover");               //获取推荐栏目点击时的遮罩层
var ct_window = document.querySelector('.ct-window');       //获取推荐栏目添加点击事件需要用到的父盒子
var btn = cover.children[1].children[2];                    //获取“我知道了”按钮
var btn2 = cover2.children[0].children[0].children[0].children[0]; //获取空气质量指数中的×按钮
var nav = document.querySelector(".nav");                   //获取导航栏
var pos = nav.children[2];
var past = [];                                              //定义past数组，用来存放搜索历史


//给每一个热门城市添加点击事件

for (let i = 0; i < hot.length; i++){
    hot[i].addEventListener('click', function (e) {             //给每一个热门城市以此绑定事件
        // console.log(hot[i].innerHTML);
        // search.innerHTML = hot[i].innerHTML;
        let ct_name = hot[i].innerHTML;
        send_ajax(ct_name);
        if (past.indexOf(hot[i].innerHTML) != -1) {
            past.splice(past.indexOf(hot[i].innerHTML), 1);     //如果past数组中已经有过某个城市，则删除past中已经存在的这个城市记录
        }
        past[past.length] = hot[i].innerHTML;                   //删除之后，将这次搜索记录添加到past数组的末尾
        // console.log(past);
        let len1 = ct_list.children.length;                     //展示历史记录时，先把之前的li清除
        for (let i = 0; i < len1; i++){
        ct_list.removeChild(ct_list.children[0]);
        }
        let len2 = hist.children[2].children.length;
        for (let i = 0; i < len2; i++){
            hist.children[2].removeChild(hist.children[2].children[0]);
        }
        for (let i = past.length - 1; i >= 0; i--){             //从past数组的末尾开始读取搜索数据，只展示三组历史记录
            if (hist.children[2].children.length < 3) {
                let li = document.createElement('li');
                li.setAttribute("class", "past-li");            //历史记录的展示样式通过past-li类控制
                li.innerHTML = past[i];
                li.addEventListener('click', function () {      //给每一个li添加点击事件，点击会发送ajax请求，切换城市天气数据
                    // console.log(li.innerHTML);
                    // search.innerHTML = li.innerHTML;
                    let ct_name = li.innerHTML;
                    send_ajax(ct_name);
                    if (past.indexOf(li.innerHTML) != -1) {
                    past.splice(past.indexOf(li.innerHTML), 1);     //增删past数组元素的规则同上
                    }
                    past[past.length] = li.innerHTML;
                    // console.log(past);
                    $(".search").animate({ top: "-667.2px" }, 300);     //点击历史记录之后需要将搜索栏向上收起
                    e.cancelBubble = true;                              //取消事件冒泡
                    ct_list.style.display = "none";                     //隐藏搜索时实时展示数据的展示栏，把展示历史记录和热门城市的div设置
                    ct_hot.style.display = "block";                     //成block是为了下次点开搜索框时看到的是历史记录，热门城市页面
                    input.value = '';                                   //点击后清空input框内容
                })
                hist.children[2].appendChild(li);                       //设置好属性后，添加元素节点
            } else {
                break;                                                  //展示的历史记录大于3个之后，就跳出循环
            }
        }
        $(".search").animate({ top: "-667.2px" }, 300);                 //点击热门城市之后需要将搜索栏向上收起
        e.cancelBubble = true;                                          //同上
        ct_list.style.display = "none";
        ct_hot.style.display = "block";
        input.value = '';
    })
}

//给搜索栏添加点击事件，点击搜索的地方之后，向下弹出搜索栏

search.addEventListener('click', function () {
    $(".search").animate({ top: "0" }, 300);
    $('body').css({                                             //当搜索栏拉下的时候，阻止页面滚动
        　　"overflow-x":"hidden",
        　　"overflow-y":"hidden"
    });
    if (hist.children[2].children.length == 0) {                //对历史记录展示数据进行判定，如果没有历史数据，则不展示历史记录栏
        hist.style.display = "none";
    } else {
        hist.style.display = "block";
    }
        ct_hot.style.display = "block";                         //在搜索栏拉下的时候，默认显示历史记录，热门城市栏
        ct_list.style.display = "none";                         //默认隐藏搜索展示栏
        input.value = '';
})

//给搜索栏中的取消按钮添加点击事件，点击后，向上收起搜索栏

btn_cancel.addEventListener("click", function (e) {
    $(".search").animate({ top: "-667.2px" }, 300);
    e.cancelBubble = true;
    ct_list.style.display = "none";
    $('body').css({                                             //搜索栏收起后，恢复页面滚动功能
        　　"overflow-x":"auto",
        　　"overflow-y":"auto"
        });
})

//给历史记录栏中的删除按钮添加点击事件，点击清空历史记录展示栏，以及past数组

hist.children[0].addEventListener("click", function () {
    let len1 = past.length;                         //获取past数组的长度和历史展示栏中li的个数
    let len2 = hist.children[2].children.length;
    for (let i = 0; i < len1; i++){
        past.pop();                                 //清空past数组
    }
    for (let i = 0; i < len2; i++){
        hist.children[2].removeChild(hist.children[2].children[0]);     //移除li
    }
    hist.style.display = "none";                    //历史记录栏没有元素之后，隐藏历史记录栏
})

//给搜索栏添加聚焦事件，获得焦点时，隐藏历史记录，热门城市栏，显示搜索展示栏

input.addEventListener('focus', function () {
    ct_hot.style.display = "none";
    ct_list.style.display = "block";
})

//给搜索展示栏添加点击事件，点击空白处，展示历史记录，热门城市栏，隐藏搜索展示栏

ct_list.addEventListener('click', function (e) {
    if (e.target == e.currentTarget) {              //当点击父盒子和子盒子不重叠的部分才触发
        ct_hot.style.display = "block";
        ct_list.style.display = "none";
        input.value = '';
        hist.style.display = "block";
    }
})

//给搜索框添加事件，oninput事件在input框的value发生改变的时候均会触发

input.oninput = function (e) {                              //采用正则表达式，输入为汉字的时候才会触发事件
   if ((input.value.replace(' ', '') != '')&&(/\w{1,}/).test(input.value.replace(' ',''))!=true) {
        let data = ['上海', '北京', '天津','重庆','南岸','沙坪坝','北碚','渝中','渝北','九龙坡','巴南','江北','新疆','西藏','宁夏','内蒙古','广西','黑龙江','哈尔滨','吉林','长春','辽宁','沈阳','大连','辽阳','河北','石家庄','邯郸','秦皇岛','保定','张家口','衡水','邢台','晋州','武安','山东','济南','青岛','烟台','济宁','德州','曲阜','江苏','南京','镇江','常州','无锡','苏州','淮安','安徽','合肥','芜湖','淮南','淮北','马鞍山','黄山','铜陵','浙江','杭州','嘉兴','湖州','宁波','金华','温州','绍兴','临安','平湖','福建','福州','厦门','泉州','三明','南平','龙岩','长乐','永安','石狮','晋江','福安','武夷山','广东','广州','深圳','汕头','珠海','韶关','东莞','海南','三亚','云南','昆明','曲靖','玉溪','贵州','贵阳','六盘水','遵义','铜仁','四川','成都','绵阳','德阳','攀枝花','乐山','南充','内江','遂宁','雅安','都江堰','湖南','长沙','衡阳','岳阳','邵阳','常德','张家界','湖北','武汉','宜昌','黄石','荆州','荆门','黄冈','河南','郑州','洛阳','开封','安阳','南阳'];                          //因为没找到合适的全国城市名称接口，只列举了几十个城市的数据进行实时展示
        let len = ct_list.children.length;                  //实时展示匹配的数据之前，应该先移除之前在展示栏类的li
        for (let i = 0; i < len; i++){
            ct_list.removeChild(ct_list.children[0]);
        }
        var j = 0;                                          //设置展示栏的展示记录上限，根据父盒子高度，最多选择展示13条城市名称
        for (let i = 0; i < data.length; i++){
            if (data[i].indexOf(input.value) != -1) {       //实时匹配，当data[i]不返回-1说明字符串中存在匹配字符，一次展示数据
                let li = document.createElement('li');
                li.setAttribute("class", "select");
                li.innerHTML = data[i];
                li.addEventListener('click', function () {      //为每一个新建节点添加点击事件，以达到点击展示栏数据就可以切换城市的效果
                    // console.log(li.innerHTML);
                    ct_name = li.innerHTML;
                    send_ajax(ct_name);
                    if (past.indexOf(li.innerHTML) != -1) {     //past数组的增删规则同上
                        past.splice(past.indexOf(li.innerHTML), 1);
                    }
                    past[past.length] = li.innerHTML;
                    // console.log(past);
                    let len1 = ct_list.children.length;         //点击切换城市之后，移除搜索展示栏内容
                    for (let i = 0; i < len1; i++){
                    ct_list.removeChild(ct_list.children[0]);
                    }
                    let len2 = hist.children[2].children.length;        //先移除历史记录栏的内容，为展示新的历史记录数据做准备
                    for (let i = 0; i < len2; i++){
                        hist.children[2].removeChild(hist.children[2].children[0]);
                    }
                    for (let i = past.length - 1; i >= 0; i--){         //从past数组末尾，向前获取三个或以下需要展示的历史记录
                        if (hist.children[2].children.length < 3) {
                            let li = document.createElement('li');
                            li.setAttribute("class", "past-li");
                            li.innerHTML = past[i];
                            li.addEventListener('click', function () {      //给展示的历史记录同样添加点击事件
                                // console.log(li.innerHTML);
                                ct_name = li.innerHTML;
                                send_ajax(ct_name);
                                if (past.indexOf(li.innerHTML) != -1) {
                                past.splice(past.indexOf(li.innerHTML), 1);
                                }
                                past[past.length] = li.innerHTML;
                                // console.log(past);
                                $(".search").animate({ top: "-667.2px" }, 300);
                                e.cancelBubble = true;
                                ct_list.style.display = "none";
                                ct_hot.style.display = "block";
                                input.value = '';
                            })
                            hist.children[2].appendChild(li);
                        } else {
                            break;                              //如果历史记录展示超过三个，则不再展示
                        }
                    }
                    $(".search").animate({ top: "-667.2px" }, 300);     //同上，点击之后，收起搜索栏
                    e.cancelBubble = true;
                    ct_list.style.display = "none";
                    ct_hot.style.display = "block";
                    input.value = '';
                })
                ct_list.appendChild(li);                                //将实时展示的元素添加到展示栏中
                j++;
                if (j == 13) {
                    break;
                }
            }
        }
    } else {
        
    }
};

//给空气质量指数的遮罩层添加点击事件，点击与子盒子不重叠的部分，可以隐藏遮罩层，恢复页面的滚动

cover2.onclick = function (e) {
    if (e.target == e.currentTarget) {
        $(".top-window").animate({ top: "140px", opacity: "0" }, 300);  //添加动画
        cover2.style.backgroundColor = "rgb(0,0,0,0)";                  //先将背景变透明。再隐藏盒子，直接隐藏盒子会影响动画的执行
        $(cover2).hide(300);
        $('body').css({
            "overflow-x": "auto",
            "overflow-y": "auto"
        })
    }
}

//给空气质量指数中的×添加点击事件，点击之后，隐藏遮罩层，恢复页面滚动

btn2.addEventListener('click', function (e) {
    $(".top-window").animate({ top: "140px", opacity: "0" }, 300);
        cover2.style.backgroundColor = "rgb(0,0,0,0)";
        $(cover2).hide(300);
        $('body').css({
            "overflow-x": "auto",
            "overflow-y": "auto"
        })
})

//给推荐栏的遮罩层添加点击事件，同样是点击和子盒子不重叠的部分，隐藏遮罩层，恢复页面滚动

cover.onclick = function (e) {
    if (e.target == e.currentTarget) {
        $(".ct-window").animate({ top: "40%",opacity:"0" },300);
        cover.style.backgroundColor = "rgb(0,0,0,0)";
        $(cover).hide(300);
        $('body').css({ 
            　　"overflow-x":"auto",
            　　"overflow-y":"auto"
            });
    }
}

//给“我知道了”按钮添加事件，点击之后可以隐藏遮罩层，恢复页面滚动

btn.addEventListener('click', function (e) {
    $(".ct-window").animate({ top: "40%",opacity:"0" },300);
    cover.style.backgroundColor = "rgb(0,0,0,0)";
    $(cover).hide(300);
    $('body').css({ 
        　　"overflow-x":"auto",
        　　"overflow-y":"auto"
        });
})
//main版块的处理函数

function mainFun(response) {
    var air = document.querySelector("#air");
    var top_window = document.querySelector(".top-window");
    air.onclick=function () {                       //空气质量指数的点击事件
        $(cover2).show();                           //先显示子盒子，还原其移动前的top值，再完成动画
        $(".top-window").css({
        "top":"140px"
        })
        cover2.style.backgroundColor = "rgb(0,0,0,.4)";
        $(".top-window").animate({ top: "120px", opacity: "1" }, 300);
        $('body').css({                             //出现遮罩层时禁止页面滚动
            "overflow-x":"hidden",
            "overflow-y":"hidden"
        })
        let t = top_window.children[0].children[3].children[0];
        top_window.children[0].children[2].innerHTML = response.air;        //将response返回的数据，进行展示
        t.innerHTML = response.air_level;
        if (response.air_level == "优") {                                   //根据不同的空气等级，显示不同的背景色
            t.style.backgroundColor = "#a3d765";                            //以下都是对数据的展示
            top_window.children[0].style.backgroundColor = "#70defc";
        } else if (response.air_level == "良") {
            t.style.backgroundColor = "#f0cc35";
            top_window.children[0].style.backgroundColor = "#80d2e5";
        } else if (response.air_level=="轻度污染"){
            t.style.backgroundColor = "#f1ab62";
            top_window.children[0].style.backgroundColor = "#90d2e5";
        } else if (response.air_level=="中度污染"){
            t.style.backgroundColor = "red";
            top_window.children[0].style.backgroundColor = "#90e2e5";
        } else if (response.air_level == "重度污染") {
            t.style.backgroundColor = "purple";
            top_window.children[0].style.backgroundColor = "#90eee5";
        }
        else {
            t.style.backgroundColor = "#822622";
            top_window.children[0].style.backgroundColor = "#90eeee";
        }
        let tr1 = top_window.children[1].children[0].children[0];
        let tr2 = top_window.children[1].children[0].children[1];
        tr1.children[0].children[0].innerHTML = response.aqi.pm25;
        tr1.children[1].children[0].innerHTML = response.aqi.pm10;
        tr1.children[2].children[0].innerHTML = response.aqi.so2;
        tr2.children[0].children[0].innerHTML = response.aqi.no2;
        tr2.children[1].children[0].innerHTML = response.aqi.o3;
        tr2.children[2].children[0].innerHTML = response.aqi.co;
    }
    air.children[0].innerHTML = response.air;
    air.children[1].innerHTML = response.air_level;
    if (response.air_level == "优") {
        air.style.backgroundColor = "#a3d765";
    } else if (response.air_level == "良") {
        air.style.backgroundColor = "#f0cc35";
    } else if (response.air_level=="轻度污染"){
        air.style.backgroundColor = "#f1ab62";
    } else if (response.air_level=="中度污染"){
        air.style.backgroundColor = "red";
    } else if (response.air_level == "重度污染") {
        air.style.backgroundColor = "purple";
    }
    else {
        air.style.backgroundColor = "#822622";
    }
    var main = document.querySelector(".main");
    main.children[0].children[0].innerHTML = response.tem;
    main.children[1].innerHTML = response.wea;
    main.children[2].innerHTML = response.win + ' ' + response.win_speed;
    var mes = response.air_tips.split('，');   
    main.children[3].innerHTML = mes[0] + "~";
    var i = 1;
    main.children[3].onclick = function () {
        main.children[3].innerHTML = mes[i] + "~";
        i++;
        i = i % mes.length;
    } 
}

//previe版块的处理函数

function previewFun(response) {                 //根据response返回值，不同的data，其src不同，确定src之后，插入准备好的图片，展示更新的数据
    var priview = document.querySelector(".preview");
    let src1 = "images/day/" + response.data[0].wea_img + ".svg";
    let src2 = "images/day/" + response.data[1].wea_img + ".svg";
    priview.children[0].children[0].children[1].innerHTML = response.data[0].tem1 + '/' + response.data[0].tem2+'°';
    priview.children[0].children[1].children[0].innerHTML = response.data[0].wea;
    priview.children[0].children[1].children[1].setAttribute("src", src1);
    priview.children[1].children[0].children[1].innerHTML = response.data[1].tem1 + '/' + response.data[1].tem2+'°';
    priview.children[1].children[1].children[0].innerHTML = response.data[1].wea;
    priview.children[1].children[1].children[1].setAttribute("src", src2);
}

//overv版块的处理函数

function overviewFun(response) {                            //同样是简单的展示数据
    var overview = document.querySelector(".overview");
    for (let i = 0; i < overview.children.length; i++){
        if (response.hours[i].time!="00:00") {
            overview.children[i].children[0].innerHTML = response.hours[i].time;
        } else {
            overview.children[i].children[0].innerHTML = "明天";
        }
        let src = "images/day/" + response.hours[i].wea_img + ".svg";
        overview.children[i].children[1].setAttribute("src", src);
        overview.children[i].children[2].innerHTML = response.hours[i].tem + "°";
    }
}

//sec-days版块的处理函数

function sec_daysFun(response,name) {
    var days = document.querySelector('.sec-days');                     //该版块分为白天和晚上，处理方法略微有点区别
    for (let i = 1; i < 8; i++){
        let dat = response.data[i - 1].date.split("-");                 //对date数据进行分割，以展示类似05/22的日期
        let src1 = "images/day/" + response.data[i - 1].wea_day_img + ".svg";
        days.children[i].children[0].innerHTML = response.data[i - 1].week;
        days.children[i].children[1].innerHTML = dat[1] + '/' + dat['2'];
        days.children[i].children[2].innerHTML = response.data[i - 1].wea_day;
        days.children[i].children[3].children[0].setAttribute('src', src1);
    }
    for (let i = 10; i < days.children.length; i++){
        let dat = response.data[i - 10].win_speed.split("-");
        let src2 = "images/night/" + response.data[i - 10].wea_night_img + ".svg";
        days.children[i].children[0].children[0].setAttribute('src', src2);
        days.children[i].children[1].innerHTML = response.data[i - 10].wea_night;
        days.children[i].children[2].innerHTML = response.data[i - 10].win[1];
        days.children[i].children[3].innerHTML = dat[1]||'2级';
    }
    days.children[1].children[0].innerHTML = "今天";
    days.children[2].children[0].innerHTML = "明天";
    days.children[3].children[0].innerHTML = "后天";
    let dat = response.data[0].date.split("-");
    let url1;                                           //因为没有找到获取昨天数据的接口，故采用历史接口，获取当月（如果为一号就是上一月）
    if (dat[2]>1) {                                     //的月份数据，发送ajax请求获取数据
        url1 = "https://v0.yiketianqi.com/api?version=history&appid=21562674&appsecret=VtBfnIs2&city="+name+"&year=" + dat[0] + "&month=" + dat[1];
    } else {
        url1 = "https://v0.yiketianqi.com/api?version=history&appid=21562674&appsecret=VtBfnIs2&city="+name+"&year=" + dat[0] + "&month=" + dat[1]-1;
    }
    $.ajax({
        type: "get",
        url: url1,
        dataType: 'json',
        error: function (xhr, status) {
            console.log(xhr, status);
        },
        success: function (response2, status) {
            // console.log(response2, status);
            let t = response2.data.length - 1;                      //处理昨天的早晚数据
            let dat = response2.data[t].ymd.split("-");
            let wea = response2.data[t].tianqi.split("~");
            let src1, src2;
            if (wea.length == 2) {
                days.children[0].children[2].innerHTML = wea[0];
                days.children[9].children[1].innerHTML = wea[1];
                if (wea[0] == "晴" || wea[0] == "多云" || wea[0] == "小雨" || wea[0] == "阴") {
                    src1 = "images/yesterday/day/" + wea[0] + ".svg";
                } else {
                    src1 = "images/yesterday/day/晴.svg";
                }
                if (wea[1] == "晴" || wea[1] == "多云" || wea[1] == "小雨" || wea[1] == "阴") {
                    src2 = "images/yesterday/day/" + wea[1] + ".svg";
                } else {
                    src2 = "images/yesterday/day/晴.svg";
                }
                } else {if (wea[0] == "晴" || wea[0] == "多云" || wea[0] == "小雨" || wea[0] == "阴") {
                    src1 = "images/yesterday/day/" + wea[0] + ".svg";
                    src2 = "images/yesterday/night/" + wea[0] + ".svg";
                } else {
                    src1 = "images/yesterday/day/晴.svg";
                    src2 = "images/yesterday/night/晴.svg";
                } }
                days.children[0].children[2].innerHTML = wea[0];
                days.children[9].children[1].innerHTML = wea[0];
                days.children[0].children[0].innerHTML = "昨天";
                days.children[0].children[1].innerHTML = dat[1] + '/' + dat['2'];
                days.children[0].children[2].style.color = "#b2b2b2";
                days.children[0].children[3].children[0].setAttribute('src', src1);
                days.children[9].children[0].children[0].setAttribute('src', src2);
                days.children[9].children[1].style.color = "#b2b2b2";
                days.children[9].children[2].innerHTML = response2.data[10].fengxiang;
                days.children[9].children[3].innerHTML = response2.data[10].fengli;
                //为绘制Echarts图标做数据准备
                var dataDay = new Array;                    //记录白天的数据
                var dataDayMap = new Array;                 //记录需要用到的白天绘制Echarts图标的数据
                var dataNight = new Array;                  //记录晚上的数据
                var dataNightMap = new Array;               //记录需要用到的晚上绘制Echarts图标的数据
                var mMax, mMin;                             //用来记录数据最大值最小值
                let x = response2.data[t].bWendu.split("°");        //获取昨天的温度数据
                let y = response2.data[t].yWendu.split("°");
                dataDay[0] = x[0];
                dataNight[0] = y[0];
                mMax = parseInt(x[0]);                      //将最大值最小值，均记录为第一个值
                mMin = parseInt(y[0]);
                for (let i = 1; i < 8; i++) {
                    dataDay[i] = response.data[i - 1].tem1;             //更新白天和夜晚的数据，并且更新最大值和最小值
                    dataNight[i] = response.data[i - 1].tem2;
                    mMax = parseInt(response.data[i - 1].tem1);
                    mMin = parseInt(response.data[i - 1].tem2);
                }
                for (let i = 0; i < dataDay.length; i++) {
                    let tempDay = {};                       //构建临时数组，将八项数据存入对象中
                    let tempNight = {};
                    tempDay.value = dataDay[i] + '°';
                    tempNight.value = dataNight[i] + '°';
                    tempDay.xAxis = i;
                    tempNight.xAxis = i;
                    tempDay.yAxis = parseInt(dataDay[i]) + 5;
                    tempNight.yAxis = parseInt(dataNight[i]) - 7;
                    dataDayMap[i] = tempDay;                //将对象存入用以绘图的的数组
                    dataNightMap[i] = tempNight;
                }
                var myChart = echarts.init(document.querySelector(".sec-days div"));    //新建echarts对象
                var option = {                      //初始化数据
                        
                    grid: {
                        width: 520,
                        height: 90,
                        left: "5%",
                        bottom: "0%",
                        // containLabel: true
                    },
                    xAxis: {                                //将x,y轴的各种线都取消
                        type: 'category',
                        boundaryGap: false,
                        show: false,
                        splitLine: {
                            show: false
                        },
                        max: 8,
                        data: ['昨天', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        show: false,
                        type: 'value',
                        axisLabel: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        max: mMax + 5,                     //将y轴的最大刻度设置为 最大值+5
                        min: mMin - 20                      //将y轴的最小刻度设置为 最小值-20
                    },
                    series: [
                        {
                            itemStyle: {
                                normal: {
                                    color: "#ffb74d",
                                        
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 2,
                                    color: "#ffb74d"
                                }
                            },
                            symbol: "circle",
                            symbolSize: '8',
                            animation: false,               //取消绘图动画
                            smooth: true,
                            type: 'line',
                            data: dataDay,
                            markPoint: {
                                data: dataDayMap,           //提供白天的数据
                                symbol: "circle",
                                itemStyle: {
                                    normal: {
                                        color: "transparent",
                                        label: {
                                            show: true,
                                            color: "#434343",
                                            fontSize: 15
                                        }
                                    }
                                },
                                symbolSize: [20, 20],
                            }
                        },
                        {
                                
                            itemStyle: {
                                normal: {
                                    color: "#4fc3f7",
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 2,
                                    color: "#4fc3f7"
                                }
                            },
                            symbol: "circle",
                            symbolSize: '8',
                            animation: false,
                            smooth: true,
                            type: 'line',
                            data: dataNight,
                            markPoint: {
                                data: dataNightMap,             //提供晚上的数据
                                symbol: "circle",
                                itemStyle: {
                                    normal: {
                                        color: "transparent",
                                        label: {
                                            show: true,
                                            color: "#434343",
                                            fontSize: 15
                                        }
                                    }
                                },
                                symbolSize: [20, 20],
                            }
                        }
                    ]
                };
                myChart.setOption(option);                      //绘图
            
        }
    })
    
}

//suggestion版块的处理函数

function suggestionFun(response) {
    var suggestion = document.querySelector(".suggestion-column");
    // console.log(suggestion);
    var Data = [];
    // 先遍历各项推荐值，将需要的数据放入自己准备的Data函数，以便后续统一使用
    (function () {
        for (i in response.data) {
            if (i == "lukuang") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#a4ade0";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "chuanyi") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#e1a4c4";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "yusan") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#c1a4e0";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "ganmao") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#dfc79c";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "lvyou") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#edac96";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "jiaotong") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#8ba5af";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "wuran") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#b28a90";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "shushidu") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#9ec48c";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "xiche") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#b5e6a8";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "yundong") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#e6d99d";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "fangshai") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#dbada0";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "diaoyu") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#a3dfd4";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "liangshai") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#a6bacc";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "huazhuang") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#e09090";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "chenlian") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#87c5dd";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
        for (i in response.data) {
            if (i == "guomin") {
                let temp = {};
                let name = response.data[i].name.split("指数");
                temp.name = i;
                temp.level = response.data[i].level;
                temp.desc = name[0];
                temp.color = "#95a3db";
                temp.adv = response.data[i].desc;
                Data[Data.length] = temp;
            }
        }
     })();
    // console.log(Data);
    for (let i = 0; i < 8; i++){           
        let src = "images/suggestion/" + Data[i].name + ".svg";
        suggestion.children[0].children[i].children[0].children[0].setAttribute("src", src);
        suggestion.children[0].children[i].children[1].innerHTML = Data[i].level;
        suggestion.children[0].children[i].children[2].innerHTML = Data[i].desc;
        suggestion.children[0].children[i].onclick=function (e) {       //给每一个推荐块添加点击事件，点击显示
            $(cover).show();
            $(".ct-window").css({
                "top":"40%"
            })
            cover.style.backgroundColor = "rgb(0,0,0,.4)";
            cover.children[1].children[0].innerHTML = Data[i].desc + "指数";
            cover.children[1].children[0].style.backgroundColor = Data[i].color;
            cover.children[1].children[1].innerHTML = Data[i].adv;
            cover.children[1].children[2].children[0].style.backgroundColor = Data[i].color;
            $(".ct-window").animate({ top: "34%", opacity: "1" }, 300);
            $('body').css({ 
                　　"overflow-x":"hidden",
                　　"overflow-y":"hidden"
            });
        }
    }
    for (let i = 8; i < 16; i++){
        let src = "images/suggestion/" + Data[i].name + ".svg";
        suggestion.children[1].children[i-8].children[0].children[0].setAttribute("src", src);
        suggestion.children[1].children[i-8].children[1].innerHTML = Data[i].level;
        suggestion.children[1].children[i - 8].children[2].innerHTML = Data[i].desc;
        suggestion.children[1].children[i-8].addEventListener('click', function (e) {
            $(cover).show();
            $(".ct-window").css({
                "top":"40%"
            })
            cover.style.backgroundColor = "rgb(0,0,0,.4)";
            cover.children[1].children[0].innerHTML = Data[i].desc + "指数";
            cover.children[1].children[0].style.backgroundColor = Data[i].color;
            cover.children[1].children[1].innerHTML = Data[i].adv;
            cover.children[1].children[2].children[0].style.backgroundColor = Data[i].color;
            $(".ct-window").animate({ top: "34%", opacity: "1" }, 300);
            $('body').css({ 
                　　"overflow-x":"hidden",
                　　"overflow-y":"hidden"
            });
        })
    }
}

//send_ajax函数用来更新全部数据，是调用前面几个板块处理函数的集合

function send_ajax(name) {
    $('body').css({ 
        　　"overflow-x":"auto",
        　　"overflow-y":"auto"
    });
    if (name) {
        ct_hot.style.display = "block";
        ct_list.style.display = "none";
        input.value = '';
        hist.style.display = "block";
    }
    name = name || '重庆';              //默认重庆
    $('#search')[0].innerHTML = name;
    $.ajax({
        type: "get",
        url:"https://v0.yiketianqi.com/api?version=v62&appid=21562674&appsecret=VtBfnIs2&city="+name,
        dataType: 'json',
        error: function (xhr, status) {
            console.log(xhr, status);
        },
        success: function (response, status) {
            // console.log(response, status);
            mainFun(response);
        }
    })
    $.ajax({
        type: "get",
        url:"https://v0.yiketianqi.com/api?version=v91&appid=21562674&appsecret=VtBfnIs2&city="+name,
        dataType: 'json',
        error: function (xhr, status) {
            console.log(xhr, status);
        },
        success: function (response, status) {
            // console.log(response, status);
            previewFun(response);
        }
    })
    $.ajax({
        type: "get",
        url:"https://v0.yiketianqi.com/api/worldchina?appid=21562674&appsecret=VtBfnIs2&city="+name,
        dataType: 'json',
        error: function (xhr, status) {
            console.log(xhr, status);
        },
        success: function (response, status) {
            // console.log(response, status);
            overviewFun(response);
        }
    })
    $.ajax({
        type: "get",
        url:"https://v0.yiketianqi.com/api?version=v91&appid=21562674&appsecret=VtBfnIs2&city="+name,
        dataType: 'json',
        error: function (xhr, status) {
            console.log(xhr, status);
        },
        success: function (response, status) {
            // console.log(response, status);
            sec_daysFun(response,name);
        }
    })
    $.ajax({
        type: "get",
        url: "https://www.tianqiapi.com/life/lifepro?appid=21562674&appsecret=VtBfnIs2&city="+name,
        dataType: 'json',
        error: function (xhr, status) {
            console.log(xhr, status);
        },
        success: function (response, status) {
            // console.log(response, status);
            suggestionFun(response);
        }
    })
 }