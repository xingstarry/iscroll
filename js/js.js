(function ($) {
    var myScroll,
        pullDownEl,
        pullDownOffset,
        pullUpEl,
        pullUpOffset;

    //todo 自己定义的变量
    var userDataSum,//存储数据的变量
        addNum = 0,
        stepLength = 5,//每次加载的步长
        sumL=0;//数据的长度
    /**
     *  刷新滚动区域的滚动条的位置（此方法在添加数据后调用）
     **/
    function refreshScrollBar() {
        console.log("刷新滚动条");
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
        }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
    }

    function pullDownAction () {
        console.log("下拉");
        //alert('pullDown')
        setTimeout(function () {
            (function reloadPage() {
                if (GetQueryString("_rf")) {
                    window.location.href = window.location.href.replace(GetQueryString("_rf"), Math.random());
                } else {
                    window.location.href = window.location.href + (window.location.href.indexOf("?") > -1 ? "&" : "?") + "_rf=" + Math.random();
                }
            })();
            myScroll.refresh();
            console.log($("#thelist").height())
        }, 1000);
    }
    //初始化数据
    function pullUpAction () {
        console.log("上拉");
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            //TODO 上拉添加数据
            add(userDataSum);
            console.log($("#thelist").height())
            myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
        }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
    }

    function loaded() {
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;
        myScroll = new iScroll('wrapper', {
            useTransition: true,
            topOffset: pullDownOffset,
            onRefresh: function () {
                if (pullDownEl.className.match('loading')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                } else if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                }
            },
            onScrollMove: function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                    this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                    this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                    this.maxScrollY = pullUpOffset;
                }
            },
            onScrollEnd: function () {
                //alert(1)
                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';

                    refreshScrollBar();
                    pullDownAction();	// Execute custom function (ajax call?)
                } else if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                    if(addNum<sumL){
                        pullUpAction();	// Execute custom function (ajax call?)

                    }else{
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '数据已全部加载完毕';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML ="数据已全部加载完毕！";
                    }
                }
            }
        });

        setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    }

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        return (r != null && r.length >= 2) ? decodeURI(r[2]) : null;
    }

    user();

    function user() {
        $.ajax({
            type:"get",
            url:"./js/json.json",
            dataType:"json",
            success: function (data) {
                userDataSum = data;
                console.log(userDataSum.body.totalNum);
                add(userDataSum)
            }
        })
    }

    function add(data){
        sumL = data.body.totalNum;
        //总的长度减去已加载的长度是否小于每次加载的长度
        if ((sumL - addNum) < stepLength) {
            stepLength = sumL % stepLength;
        }
        //每次加载的步长长度
        addNum += stepLength;
        if (addNum >= sumL) {
            addNum = sumL;
        }
        var el, litext = "", i;
        el = el = $('#thelist');
        for( i = addNum - stepLength+1; i < addNum+1; i++){
            litext  +='' +
                '<li>aaa'+ i +'</li>'
        }
        //添加进详情列别里面
        el.append(litext);


        //TODO 首次添加数据以后调用（刷新滚动条高度）
        refreshScrollBar();
    }


})(jQuery);