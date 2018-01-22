require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','area','slider','base','layui'],function($,template,md5,api,area){

        /**
         * 数据渲染
         */
        layui.use(['layer', 'form'], function(){
            var layer = layui.layer
                ,form = layui.form;

            var user_id = $.cookie('user_id'),
                access_token = $.cookie('access_token');

            // var user_id = 1000000003,
            // 	access_token = "da2c29b1-0db9-434d-860d-93834ca0f576";

            //获取联系人信息
            $.ajax({
                type: 'get',
                url: api + '/api/shr?access_token='+access_token+'&user_id='+user_id,
                data: {
                    "user_id": user_id,
                    "access_token": access_token
                },
                dataType: 'json',
                success:function(consigneeData){
                    //console.log(consigneeData);
                    if (consigneeData.err_code == 0) {
                        if (consigneeData.data != null) {
                            $("#buyer_consignee_info").load("include/buyer-consignee-modify.html",function () {
                                $("#shr").val(consigneeData.data.shr);
                                $("#shr_address").val(consigneeData.data.shr_address);
                                $("#shr_phone").val(consigneeData.data.shr_phone);

                                //获取默认发货地点
                                $('#province option:selected').text(consigneeData.data.province);
                                $('#city option:selected').text(consigneeData.data.city);
                                $('#town option:selected').text(consigneeData.data.district);
                                //地区
                                var province = $("#province"),
                                    city = $("#city"),
                                    town = $("#town");
                                for(var i = 0; i < provinceList.length; i++){
                                    addEle(province, provinceList[i].name);
                                }

                                function addEle(ele, value){
                                    var optionStr = "";
                                    optionStr = "<option value=" + value + ">" + value + "</option>";
                                    ele.append(optionStr);
                                }

                                function removeEle(ele){
                                    ele.find("option").remove();
                                    var optionStar = "<option value=" + "请选择" + ">" + "请选择" + "</option>";
                                    ele.append(optionStar);
                                }
                                var provinceText, cityText, cityItem;
                                province.on("change", function() {
                                    provinceText = $(this).val();
                                    $("#province").attr("val", provinceText);
                                    $.each(provinceList, function(i, item) {
                                        if(provinceText == item.name){
                                            cityItem = i;
                                            return cityItem
                                        }
                                    });
                                    removeEle(city);
                                    removeEle(town);
                                    $.each(provinceList[cityItem].cityList, function(i, item){
                                        addEle(city, item.name);
                                    });
                                });
                                city.on("change", function(){
                                    cityText = $(this).val();
                                    $("#city").attr("val", cityText);
                                    removeEle(town);
                                    $.each(provinceList, function(i, item){
                                        if(provinceText == item.name){
                                            cityItem = i;
                                            return cityItem
                                        }
                                    });
                                    $.each(provinceList[cityItem].cityList, function(i, item){
                                        if(cityText == item.name){
                                            for(var n = 0; n < item.areaList.length; n++){
                                                addEle(town, item.areaList[n])
                                            }
                                        }
                                    });
                                });


                                $("#modify_btn").click(function () {
                                    if ($("#shr").val() == ""|| $("#shr").val() != $("#shr").val().replace(/^ +| +$/g,'')) {
                                        layer.alert('收货人信息不能为空');
                                        return false;
                                    }else if ($("#shr_address").val() == "" || $("#shr_address").val() != $("#shr_address").val().replace(/^ +| +$/g,'')) {
                                        layer.alert('收货地址不能为空');
                                        return false;
                                    }else if ($("#shr_phone").val() == "" || !( /^1(3|4|5|7|8)\d{9}$/.test($("#shr_phone").val()))) {
                                        layer.alert('请输入正确的手机号');
                                        return false;
                                    }else if($("#province option:selected").text() == '省份'){
                                        layer.alert("省份没有选择");
                                        return false;
                                    }else if($("#city option:selected").text() == '请选择'){
                                        layer.alert("城市没有选择");
                                        return false;
                                    }else if($("#town option:selected").text() == '请选择'){
                                        layer.alert("区/县没有选择");
                                        return false;
                                    }else{
                                        var containsObj = {
                                            user_id: user_id,
                                            access_token: access_token,
                                            shr: $("#shr").val(),
                                            shr_address: $("#shr_address").val(),
                                            shr_phone: $("#shr_phone").val(),
                                            province : $("#province option:selected").text(),
                                            city : $("#city option:selected").text(),
                                            district : $("#town option:selected").text()
                                        };
                                        $.ajax({
                                            type: "post",
                                            url: api + '/api/shr?access_token='+access_token+'&user_id='+user_id,
                                            async:true,
                                            data: JSON.stringify(containsObj),
                                            dataType: "json",
                                            contentType: "application/json; charset=utf-8",
                                            success:function(changmsg){
                                                //console.log(changmsg);
                                                //window.location.reload();
                                                layer.alert('修改成功！');
                                            },
                                            error:function(){
                                                layer.alert('发生错误，修改失败！');
                                            }
                                        });
                                    }
                                });
                            });

                        }else{
                            $("#buyer_consignee_info").load("include/buyer-consignee-upload.html",function () {
                                //地区
                                var province = $("#province"),
                                    city = $("#city"),
                                    town = $("#town");
                                for(var i = 0; i < provinceList.length; i++){
                                    addEle(province, provinceList[i].name);
                                }

                                function addEle(ele, value){
                                    var optionStr = "";
                                    optionStr = "<option value=" + value + ">" + value + "</option>";
                                    ele.append(optionStr);
                                }

                                function removeEle(ele){
                                    ele.find("option").remove();
                                    var optionStar = "<option value=" + "请选择" + ">" + "请选择" + "</option>";
                                    ele.append(optionStar);
                                }
                                var provinceText, cityText, cityItem;
                                province.on("change", function() {
                                    provinceText = $(this).val();
                                    $("#province").attr("val", provinceText);
                                    $.each(provinceList, function(i, item) {
                                        if(provinceText == item.name){
                                            cityItem = i;
                                            return cityItem
                                        }
                                    });
                                    removeEle(city);
                                    removeEle(town);
                                    $.each(provinceList[cityItem].cityList, function(i, item){
                                        addEle(city, item.name);
                                    });
                                });
                                city.on("change", function(){
                                    cityText = $(this).val();
                                    $("#city").attr("val", cityText);
                                    removeEle(town);
                                    $.each(provinceList, function(i, item){
                                        if(provinceText == item.name){
                                            cityItem = i;
                                            return cityItem
                                        }
                                    });
                                    $.each(provinceList[cityItem].cityList, function(i, item){
                                        if(cityText == item.name){
                                            for(var n = 0; n < item.areaList.length; n++){
                                                addEle(town, item.areaList[n])
                                            }
                                        }
                                    });
                                });

                                $("#hold_btn").click(function () {
                                    if ($("#shr").val() == ""|| $("#shr").val() != $("#shr").val().replace(/^ +| +$/g,'')) {
                                        layer.alert('收货人信息不能为空');
                                        return false;
                                    }else if ($("#shr_address").val() == "" || $("#shr_address").val() != $("#shr_address").val().replace(/^ +| +$/g,'')) {
                                        layer.alert('收货地址不能为空');
                                        return false;
                                    }else if ($("#shr_phone").val() == "" || !( /^1(3|4|5|7|8)\d{9}$/.test($("#shr_phone").val()))) {
                                        layer.alert('请输入正确的手机号');
                                        return false;
                                    }else if($("#province option:selected").text() == '省份'){
                                        layer.alert("省份没有选择");
                                        return false;
                                    }else if($("#city option:selected").text() == '请选择'){
                                        layer.alert("城市没有选择");
                                        return false;
                                    }else if($("#town option:selected").text() == '请选择'){
                                        layer.alert("区/县没有选择");
                                        return false;
                                    }else{
                                        var containsObj = {
                                            user_id: user_id,
                                            access_token: access_token,
                                            shr: $("#shr").val(),
                                            shr_address: $("#shr_address").val(),
                                            shr_phone: $("#shr_phone").val(),
                                            province : $("#province option:selected").text(),
                                            city : $("#city option:selected").text(),
                                            district : $("#town option:selected").text()
                                        };
                                        console.log(containsObj );
                                        $.ajax({
                                            type: "post",
                                            url: api + '/api/shr?access_token='+access_token+'&user_id='+user_id,
                                            async:true,
                                            data: JSON.stringify(containsObj),
                                            dataType: "json",
                                            contentType: "application/json; charset=utf-8",
                                            success:function(changmsg){
                                               // console.log(changmsg);
                                                //window.location.reload();
                                                layer.alert('保存成功！');
                                            },
                                            error:function(){
                                                layer.alert('发生错误，保存失败！');
                                            }
                                        });
                                    }
                                });
                                $("#cancel_btn").click(function () {
                                    window.location.reload();
                                });
                            });
                        }
                    }
                }
            });
            /**
             * 交互效果
             */
            //左侧栏颜色改变
            $(".buyer-content .buyer-slider dl").eq(0).find("dd:nth-of-type(4)").find("a").css({"color": "#ff3c00"});
        });
    });
});