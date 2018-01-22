require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','layui','slider','base'],function($,template,md5,api){
        
    	/**
    	 * 数据渲染
    	 */
        layui.use(['layer', 'form'], function(){
            var layer = layui.layer
                ,form = layui.form;

			var user_id = $.cookie('user_id'),
				access_token = $.cookie('access_token');
//
//             var user_id = 1000000003,
//                 access_token = "6fd19026-3794-46df-ad02-cf2c5b51638d";


            $.ajax({
                type: 'get',
                url: api + '/api/purchase_contacts?access_token='+access_token+'&user_id='+user_id,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success:function(r){
                    //console.log(r);
                    if(r.data.company != ""){
                        $("#pay-contains").val(r.data.phone_no);
                        $("#pay-username").val(r.data.contact);
                        $("#pay-company").html(r.data.company);

                        //点击发布按钮
                        $("#change-psw-submit").on("click", function(){
                            var cateVal = $(".cate").html(),
                                cateMingVal = $(".cate-ming").html(),
                                cateModelVal = $(".cate-model").html(),

                                danWeiVal =  $("input[name='unit']:checked").val(),
                                danWeiNum = $("#dan").val(),

                                priceNum = $("#price").val(),

                                payAddress = $("#pay-address").val(),
                                payContains = $("#pay-contains").val(),
                                payUsername = $("#pay-username").val(),
                                textareaVal = $("textarea").val();

                            //

                            if ("" == cateVal) {
                                $(".error-msg").html("品类没有选择");
                            }else if ("" == cateMingVal) {
                                $(".error-msg").html("品名没有选择");
                            }else if ("" == cateModelVal) {
                                $(".error-msg").html("规格没有选择");
                            }else if ("" == danWeiNum) {
                                $(".error-msg").html("采购数量没有填入");
                            }else if (3000 > parseInt(danWeiNum)) {
                                $(".error-msg").html("采购数量不足,最低需要3000");
                            }else if ("" == priceNum) {
                                $(".error-msg").html("预期价格没有填入");
                            }else if ("" == payAddress) {
                                $(".error-msg").html("交货地点没有填入");
                            }else if (payContains == ""  || !( /^1(3|4|5|7|8)\d{9}$/.test($("#pay-contains").val()))) {
                                $(".error-msg").html("请输入正确的手机号");
                            }else if ("" == payUsername) {
                                $(".error-msg").html("您的称呼没有填入");
                            }else{
                                $(".error-msg").html("");
                                //发布请求
                                var purObj = {
                                    'category': cateVal,
                                    'pname': cateMingVal,
                                    'spec': cateModelVal,
                                    'ammount': danWeiNum,
                                    'price': priceNum,
                                    'unit': danWeiVal,
                                    'pur_address': payAddress,
                                    'phone_no': payContains,
                                    'contact': payUsername,
                                    'remark': textareaVal,
                                    'is_intrust': 0
                                };
                                //console.log(purObj);
                                $.ajax({
                                    type: 'post',
                                    url: api + '/api/purchase?access_token='+access_token+'&user_id='+user_id,
                                    data: JSON.stringify(purObj),
                                    dataType: 'json'
                                }).then(function(purData){
                                    //console.log(purData);
                                    layer.alert("发布成功");
                                });

                                $("#dan").val('');
                                $("#price").val('');
                                $("#pay-address").val('');
                                $("textarea").val('');
                                $('.cate').html('');
                                $('.cate-ming').html('');
                                $('.cate-model').html('');
                            }
                        });

                        //点击委托发布按钮
                        $("#change-psw-weituo-submit").on("click", function(){
                            var cateVal = $(".cate").html(),
                                cateMingVal = $(".cate-ming").html(),
                                cateModelVal = $(".cate-model").html(),

                                danWeiVal =  $("input[name='unit']:checked").val(),
                                danWeiNum = $("#dan").val(),

                                priceNum = $("#price").val(),

                                payAddress = $("#pay-address").val(),
                                payContains = $("#pay-contains").val(),
                                payUsername = $("#pay-username").val(),
                                textareaVal = $("textarea").val();

                            //
                            // var user_id = 1000000003,
                            // 	access_token = "da2c29b1-0db9-434d-860d-93834ca0f576";
                            //

                            if ("" == cateVal) {
                                $(".error-msg").html("品类没有选择");
                            }else if ("" == cateMingVal) {
                                $(".error-msg").html("品名没有选择");
                            }else if ("" == cateModelVal) {
                                $(".error-msg").html("规格没有选择");
                            }else if ("" == danWeiNum) {
                                $(".error-msg").html("采购数量没有填入");
                            }else if (3000 > parseInt(danWeiNum)) {
                                $(".error-msg").html("采购数量不足,最低需要3000");
                            }else if ("" == priceNum) {
                                $(".error-msg").html("预期价格没有填入");
                            }else if ("" == payAddress) {
                                $(".error-msg").html("交货地点没有填入");
                            }else if (payContains == ""  || !( /^1(3|4|5|7|8)\d{9}$/.test($("#pay-contains").val()))) {
                                $(".error-msg").html("请输入正确的手机号");
                            }else if ("" == payUsername) {
                                $(".error-msg").html("您的称呼没有填入");
                            }else{
                                $(".error-msg").html("");
                                //发布请求
                                var purObj = {
                                    'category': cateVal,
                                    'pname': cateMingVal,
                                    'spec': cateModelVal,
                                    'ammount': danWeiNum,
                                    'price': priceNum,
                                    'unit': danWeiVal,
                                    'pur_address': payAddress,
                                    'phone_no': payContains,
                                    'contact': payUsername,
                                    'remark': textareaVal,
                                    'is_intrust': 1
                                };
                                //console.log(purObj);
                                $.ajax({
                                    type: 'post',
                                    url: api + '/api/purchase?access_token='+access_token+'&user_id='+user_id,
                                    data: JSON.stringify(purObj),
                                    dataType: 'json'
                                }).then(function(purData){
                                    //console.log(purData);
                                    layer.alert("委托发布成功");
                                });

                                $("#dan").val('');
                                $("#price").val('');
                                $("#pay-address").val('');
                                $("textarea").val('');
                                $('.cate').html('');
                                $('.cate-ming').html('');
                                $('.cate-model').html('');
                            }
                        });

                        /**
                         * 交互效果
                         */
                        //下拉框
                        $(".cate").on("click", function(){
                            $(".cate-down").toggle();
                            //下拉框隐藏
                            $('#pname').css({'display': 'none'});
                            $('#spec').css({'display': 'none'});
                            $('.dan-wei-down').css({'display': 'none'});
                            $('.dan-wei-one-down').css({'display': 'none'});
                        });
                        $(".cate-ming").on("click", function(){
                            $(".cate-ming-down").toggle();
                            //下拉框隐藏
                            $('#catgory').css({'display': 'none'});
                            $('#spec').css({'display': 'none'});
                            $('.dan-wei-down').css({'display': 'none'});
                            $('.dan-wei-one-down').css({'display': 'none'});
                        });
                        $(".cate-model").on("click", function(){
                            $(".cate-model-down").toggle();
                            //下拉框隐藏
                            $('#pname').css({'display': 'none'});
                            $('#catgory').css({'display': 'none'});
                            $('.dan-wei-down').css({'display': 'none'});
                            $('.dan-wei-one-down').css({'display': 'none'});
                        });
                        $(".dan-wei").on("click", function(){
                            $(".dan-wei-down").toggle();
                            //下拉框隐藏
                            $('#pname').css({'display': 'none'});
                            $('#catgory').css({'display': 'none'});
                            $('#spec').css({'display': 'none'});
                            $('.dan-wei-one-down').css({'display': 'none'});
                        });
                        $(".dan-wei-one").on("click", function(){
                            $(".dan-wei-one-down").toggle();
                            //下拉框隐藏
                            $('#pname').css({'display': 'none'});
                            $('#catgory').css({'display': 'none'});
                            $('.dan-wei-down').css({'display': 'none'});
                            $('#spec').css({'display': 'none'});
                        });

                        //输入框获得焦点后
                        $("#dan").on("focus", function(){
                            $(".dan-wei-down,#catgory,#pname,#spec,.dan-wei-one-down").hide();
                        });
                        $("#price").on("focus", function(){
                            $(".dan-wei-down,#catgory,#pname,#spec,.dan-wei-one-down").hide();
                        });
                        $("#pay-address").on("focus", function(){
                            $(".dan-wei-down,#catgory,#pname,#spec,.dan-wei-one-down").hide();
                        });
                        $("#pay-contains").on("focus", function(){
                            $(".dan-wei-down,#catgory,#pname,#spec,.dan-wei-one-down").hide();
                        });
                        $("#pay-username").on("focus", function(){
                            $(".dan-wei-down,#catgory,#pname,#spec,.dan-wei-one-down").hide();
                        });
                        $("textarea").on("focus", function(){
                            $(".dan-wei-down,#catgory,#pname,#spec,.dan-wei-one-down").hide();
                        });

                        //点击后显示
                        $(".cate-down span").on("click", function(){
                            $(this).html($(this).html());
                            $(".cate-down").hide();
                        });
                        $(".cate-ming-down span").on("click", function(){
                            $(this).html($(this).html());
                            $(".cate-ming-down").hide();
                        });
                        $(".cate-model-down span").on("click", function(){
                            $(this).html($(this).html());
                            $(".cate-model-down").hide();
                        });
                        $(".dan-wei-down span").on("click", function(){
                            $(".dan-wei").html("&nbsp;&nbsp;&nbsp;" + $(this).html());
                            $(".dan-wei-down").hide();
                        });
                        $(".dan-wei-one-down span").on("click", function(){
                            $(".dan-wei-one").html("&nbsp;" + $(this).html());
                            $(".dan-wei-one-down").hide();
                        });


                        //下拉列表
                        $("#catgory,#pname,#spec").css({'width': '212px'});
                        var cateList = {
                            "cate": [{
                                name: '胶合板',
                                pname: ["地板基材", "三胺基板", "三聚氰胺板", "生态板", "大芯板", "建筑模板", "家具板", "集装箱板", "清水模板", "覆膜板", "包装板", "装饰板", "异形板", "防火板", "木塑板", "LVL顺向板", "海洋板", "免漆板", "桥梁板", "木门板"],
                                spec: ["1830*915*12.5", "1830*915*14.5", "1830*915*15", "1830*915*10.5", "1830*915*11", "2440*1220*18", "2440*1220*15", "2440*1220*9", "2440*1220*5", "1220*1220*13.2", "1220*920*14", "1220*920*13.2", "1220*920*12.5"]
                            },
                                {
                                    name: '密度板',
                                    pname: ["高密度板", "中密度板", "低密度板", "免漆密度板", "饰面密度板", "三胺密度板", "未饰面密度板"],
                                    spec: ["2440*1220*18", "2440*1220*15", "2440*1220*9", "2440*1220*7", "2440*1220*5"]
                                },
                                {
                                    name: '刨花板',
                                    pname: ["素面刨花板", "定向刨花板", "OSB欧松板", "单面三胺刨花板", "双面三胺刨花板", "空心刨花板", "免漆刨花板", "单饰面刨花板", "双饰面刨花板"],
                                    spec: ["2440*1220*18", "2440*1220*15", "2440*1220*9", "2440*1220*7", "2440*1220*5"]
                                },
                                {
                                    name: '单板',
                                    pname: ["桉木单板", "杨木单板", "松木单板", "白桦单板", "其他单板"],
                                    spec: ["1270*640*1.7", "1270*640*2.2", "1270*630*2.2", "1270*630*1.7", "1270*630*1.5", "1270*640*1.5", "1270*630*3.2", "1270*630*3.0", "1270*630*2.8", "1270*490*2.2", "1270*490*1.7", "970*500*1.7", "970*490*1.7", "970*640*2.2", "970*500*2.2", "970*480*2.2", "960*480*2.2", "960*480*2.0", "960*480*1.7", "960*480*1.5", "960*480*1.3"]
                                },
                                {
                                    name: '面底板',
                                    pname: ["桉木", "杨木", "松木", "杂木", "奥古曼", "桦木", "丝光黄桐", "铅笔柏", "山桂花", "水曲柳", "红樱桃", "冰糖果", "贝壳杉", "红橡", "克隆", "科技木", "其他"],
                                    spec: ["2540*1270", "1930*970", "2460*1210"]
                                },
                                {
                                    name: '实木板',
                                    pname: ["榉木", "榆木", "水曲柳", "橡木", "松木", "杉木", "莎木", "樟木", "刨光材板", "方板材", "方料口", "料锯材", "木方", "木条", "规格材", "方木", "方条", "干燥材", "刨光材", "干板", "烘干板", "木料", "板条", "墙板/壁板", "集成材", "指接板", "拼板", "东北材", "西南材", "海南材", "鸡翅木", "黄檀", "红檀", "紫檀", "绿檀", "花梨木", "红木", "乌木", "酸枝木"],
                                    spec: ["无规格"]
                                }
                            ]
                        };
                        var jsonobjct = eval(cateList);
                        var json = jsonobjct.cate;
                        // 一级
                        var option1 = '';
                        $.each(json, function(index, indexItems) {
                            option1 += "<span>" + indexItems.name + "</span><br/>";
                        });
                        $("#catgory").append(option1);
                        $("#catgory").on("click", function(e) {
                            var e = e || window.event;
                            $('.cate').html(e.target.innerHTML);
                            $(this).hide();
                            selectpname(json);
                            selectpname1(json);
                            $('.cate-ming').html('');
                            $('.cate-model').html('');
                        });
                        // 2-1
                        function selectpname(data) {
                            var option2 = '';
                            var selectedIndex = $(".cate").text();

                            $("#pname").empty();
                            $.each(data, function(index, indexItems) {
                                if(indexItems.name != selectedIndex) {
                                    return;
                                } else {
                                    $.each(indexItems.pname, function(index, Items) {
                                        option2 += "<span>" + Items + "</span><br/>";
                                    });
                                }
                            });
                            $("#pname").append(option2);

                            $("#pname").on("click", function(e){
                                var e = e || window.event;
                                $('.cate-ming').html(e.target.innerHTML);
                                $(this).hide();
                            });
                        };
                        // 2-2
                        function selectpname1(data) {
                            var option3 = '';
                            var selectedIndex = $(".cate").text();
                            $("#spec").empty();
                            $.each(data, function(index, indexItems) {
                                if(indexItems.name != selectedIndex) {
                                    return;
                                } else {
                                    $.each(indexItems.spec, function(index, Items) {
                                        option3 += "<span>" + Items + "</span><br/>";
                                    });
                                }

                            });
                            $("#spec").append(option3);

                            $("#spec").on("click", function(e){
                                var e = e || window.event;
                                $('.cate-model').html(e.target.innerHTML);
                                $(this).hide();
                            });
                        };



                    }else{
                    	layer.alert("您的公司还没实名认证，请先去实名认证");
					}

                }
            });

			//左侧栏颜色改变
			$(".buyer-content .buyer-slider dl").eq(1).find("dd:nth-of-type(1)").find("a").css({"color": "#ff3c00"});
        });
    });
});