require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base','layui'],function($,template,md5,api){
        /**
         * 数据渲染
         */

        layui.use(['layer', 'form'], function(){
            var layer = layui.layer
                ,form = layui.form;
            var user_id = $.cookie('user_id'),
                access_token = $.cookie('access_token');
            //
            // var user_id = 1000000003,
            //     access_token = "adf7c99e-a16c-4e75-b8a0-3c43314bac90";
            //获取地址栏的pur_id;
            //左侧栏颜色改变
            $(".buyer-content .buyer-slider dl").eq(1).find("dd:nth-of-type(2)").find("a").css({"color": "#ff3c00"});
            function GetQueryString(name)
            {
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r!=null)return  unescape(r[2]); return null;
            }
            var pur_id = GetQueryString("pur_id");
            var url = api + '/api/purchase_bg?access_token='+access_token+'&user_id='+user_id+'&pur_id ='+pur_id;
            //求购单页面信息
            $.get("include/buyer-buyin-orderinfo.html", function(ordermsgData){
                var render = template.compile(ordermsgData);

                //获取求购单信息
                $.ajax({
                    type: 'get',
                    url: url,
                    dataType: 'json',
                    data: {
                        "user_id": user_id,
                        "access_token": access_token,
                        "pur_id": pur_id
                    },
                    contentType: "application/json; charset=utf-8",
                    success:function(offerData){
                        //console.log(offerData);
                        if (offerData.err_code == 0) {
                            if (offerData.data != null) {
                                var html = render(offerData);
                                $("#order-details").html(html);

                                //根据状态来判断按钮的显示和隐藏.,状态等于0或1，显示【关闭】按钮。状态等于0显示【停止接收报价】按钮。
                                if (offerData.data.status == 0 || offerData.data.status == 1){
                                    $('#close-btn').show();
                                }else{
                                    $('#close-btn').hide();
                                }
                                if (offerData.data.status == 0){
                                    $('#stop-btn').show();
                                    //$(".deal-btn").attr("disabled", true);
                                }else{
                                    $('#stop-btn').hide();
                                }

                                //关闭按钮
                                $("#close-btn").click(function(){
                                    layer.open({
                                        content: '是否关闭此求购单？'
                                        ,btn: ['是', '否']
                                        ,yes: function(offerData){
                                            //alert(333);
                                            //console.log(pur_id);
                                            $.ajax({
                                                type: 'get',
                                                url : api +  '/api/purchase_bg_close?access_token='+access_token+'&user_id='+user_id+'&pur_id ='+pur_id ,
                                                dataType: 'json',
                                                data: {
                                                    "user_id": user_id,
                                                    "access_token": access_token,
                                                    "pur_id": pur_id
                                                },
                                                success:function(closeData){
                                                    //console.log(closeData);
                                                    if (closeData.err_code == 0) {
                                                        $('#close-btn').hide();
                                                        $('#stop-btn').hide();
                                                        $('.deal-btn').hide();
                                                        $(".th-zh").css({"display":"none ! important"});
                                                    }
                                                    layer.alert('已经关闭', {icon: 1});
                                                }
                                            });
                                        },btn2: function(){
                                            //按钮【按钮二】的回调
                                        }
                                        ,cancel: function(){
                                            //右上角关闭回调
                                        }
                                    });
                                });

                                //停止接收报价按钮
                                $("#stop-btn").click(function(){
                                    //console.log(pur_id);
                                    layer.open({
                                        content: '是否停止接收新的报价？'
                                        ,btn: ['是', '否']
                                        ,yes: function(offerData){
                                            $.ajax({
                                                type: 'get',
                                                url: api + '/api/purchase_bg_stop?access_token='+access_token+'&user_id='+user_id+'&pur_id ='+pur_id,
                                                dataType: 'json',
                                                data: {
                                                    "user_id": user_id,
                                                    "access_token": access_token,
                                                    "pur_id": pur_id
                                                },
                                                success:function(stopData){
                                                    //console.log(stopData);
                                                    if (stopData.err_code == 0) {
                                                        $('.deal-btn').show();
                                                        //$(".deal-btn").attr("disabled", false);
                                                        $(".th-zh").show();
                                                        window.location.reload();
                                                    }
                                                }
                                            });
                                        },btn2: function(){
                                            //按钮【按钮二】的回调
                                        }
                                        ,cancel: function(){
                                            //右上角关闭回调
                                        }
                                    });
                                });

                            }
                        }
                    }
                });
            });


            //报价页面信息
            $.ajax({
                type: 'get',
                url: api + '/api/purchase_bg?access_token='+access_token+'&user_id='+user_id+'&pur_id ='+pur_id,
                dataType: 'json',
                data: {
                    "user_id": user_id,
                    "access_token": access_token,
                    "pur_id": pur_id
                },
                contentType: "application/json; charset=utf-8",

                success:function(b){
                    //状态等于1显示【与其交易】按钮
                    if (b.data.status == 1){
                        $('.deal-btn').show();
                        $(".th-zh").show();
                    }else{
                        $('.deal-btn').hide();
                        $(".th-zh").css({"display":"none ! important"});
                    }
                    if (b.data == null){
                        $('.deal-btn').hide();
                        $(".th-zh").css({"display":"none ! important"});
                    }
                    //console.log(b);
                    var listdata=b.data.list;
                    //var listdata =[{"quote_id":"3","supplier_name":"adas","price":"30","phone_no":"12142141","quote_date":"2018"}];
                    var html=template('tpl-buyin-datails-info',listdata);
                    document.getElementById('buyin-datails-info').innerHTML=html;

                    // if (b.data.status == 0){
                    //     $('#stop-btn').show();
                    //     //$(".deal-btn").attr("disabled", true);
                    // }else{
                    //     $('#stop-btn').hide();
                    // }
                    if (b.data.status !== 0){
                            $('#stop-btn').hide();


                        //与其交易按钮
                        $(".deal-btn").click(function(listdata){
                            var listinfoquote_id = $(this).parents("tr").children("td:nth-child(1)").text();
                            var listinfosupplier = $(this).parents("tr").children("td:nth-child(2)").text();
                            var quote_id =listinfoquote_id;
                            var supplier_name =listinfosupplier;
                            //$(this).parents("tr").className = 'selected-dealer';
                            var deallist = $(this);
                            //console.log( $(this));
                            //console.log(quote_id);
                            layer.open({
                                content: '是否选择与'+supplier_name+'交易并关闭求购单？'
                                ,btn: ['是', '否']
                                ,yes: function(b){
                                    //alert(111);
                                    $.ajax({
                                        type: 'get',
                                        url: api + '/api/purchase_bg_trade?access_token='+access_token+'&user_id='+user_id+'&pur_id ='+pur_id+'&quote_id='+quote_id,
                                        dataType: 'json',
                                        data : {
                                            "access_token": access_token,
                                            "user_id": user_id,
                                            "pur_id": pur_id,
                                            "quote_id": quote_id
                                        },
                                        success:function(tokenData){
                                            //console.log(tokenData);
                                            if (tokenData.err_code ==0) {
                                                deallist.parents("tr").css({"background-color":"#ff3c00"});
                                                deallist.parents("tr").find("td").css({"color":"#fff"});
                                                //$(".selected-dealer").css({"background-color":"#ff3c00","color":"#fff"});
                                                $('#close-btn').hide();
                                                $('#stop-btn').hide();
                                                $('.deal-btn').hide();
                                                $(".th-zh").css({"display":"none"});
                                                var deal_quote_id = quote_id;
                                                layer.alert('与其交易', {icon: 1});
                                            }else{
                                                layer.alert('发生错误', {icon: 1});
                                            }
                                        }
                                    });
                                },btn2: function(){
                                    //按钮【按钮二】的回调
                                }
                                ,cancel: function(){
                                    //右上角关闭回调
                                }
                            });
                        });
                    }else{
                        $('#stop-btn').show();
                        $(".deal-btn").click(function(listdata){
                            layer.alert('请先停止接收新的报价');
                        });

                    }

                }
            });

        });
    });
});
