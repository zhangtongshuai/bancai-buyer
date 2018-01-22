require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base','layui'],function($,template,md5,api){
        /**
         * 数据渲染
         */
        //发票信息维护
        layui.use(['layer', 'form'], function(){
            var layer = layui.layer
                ,form = layui.form;
            var user_id = $.cookie('user_id'),
                access_token = $.cookie('access_token');
            //
            // var user_id = 1000000003,
            //     access_token = "adf7c99e-a16c-4e75-b8a0-3c43314bac90";
            //左侧栏颜色改变
            $(".buyer-content .buyer-slider dl").eq(5).find("dd:nth-of-type(1)").find("a").css({"color": "#ff3c00"});

            $.ajax({
                type: 'get',
                url: api + '/api/invoice?access_token='+access_token+'&user_id='+user_id,
                data: {
                    "user_id": user_id,
                    "access_token": access_token
                },
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success:function(s){
                    //console.log(s);
                    if(s.data.title != null){

                            $("#invoice-info-maintain").load("include/invoice-info.html",function(){
                                $("#title").val(s.data.title);
                                $("#credit_code").val(s.data.credit_code);
                                $("#register_address").val(s.data.register_address);
                                $("#register_phone").val(s.data.register_phone);
                                $("#bank").val(s.data.bank);
                                $("#bank_account").val(s.data.bank_account);

                                $("#modifybtn").click(function () {

                                    if($("#title").val()=='')
                                    {
                                        layer.alert('单位名称不能为空');
                                        return false;
                                    }else if($("#credit_code").val()==''|| !(  /^[0-9a-zA-Z]*$/g.test($("#credit_code").val())))
                                    {
                                        layer.alert('纳税人识别码不能为空且必须为数字或字母');
                                        return false;
                                    }else if(!(/^[\d-]*$/.test($("#register_phone").val())))
                                    {
                                        layer.alert('注册电话只允许输入数字和中划线"-"');
                                        return false;
                                    }else if(!( /^[0-9]*$/g.test($("#bank_account").val())))
                                    {
                                        layer.alert('银行账户只允许输入数字');
                                        return false;
                                    }else{
                                        var insertData = {
                                            "user_id":user_id,
                                            "access_token":access_token,
                                            "title" :$("#title").val(),
                                            "credit_code" : $("#credit_code").val(),
                                            "register_address" : $("#register_address").val(),
                                            "register_phone" : $("#register_phone").val(),
                                            "bank" : $("#bank").val(),
                                            "bank_account" : $("#bank_account").val()
                                        };
                                        $.ajax({
                                            type:"POST",
                                            async:false,
                                            data: JSON.stringify(insertData),
                                            dataType: "json",
                                            url:api + '/api/invoice?access_token='+access_token+'&user_id='+user_id,
                                            contentType: "application/json; charset=utf-8",
                                            success : function(msg){
                                                //console.log(msg);
                                                layer.alert('修改成功');
                                            },
                                            error:function(){
                                                layer.alert('发生错误，修改失败！');
                                            }
                                        });
                                    }
                                });
                            });
                    }else{
                            layer.alert('您还没有维护发票信息,请提交发票信息');
                            $("#invoice-info-maintain").load("include/invoice-info-upload.html",function(){

                                $("#holdbtn").click(function () {
                                    //console.log($("#title").val());
                                    if($("#title").val()=='')
                                    {
                                        layer.alert('单位名称不能为空');
                                        return false;
                                    }else if($("#credit_code").val()==''|| !(  /^[0-9a-zA-Z]*$/g.test($("#credit_code").val())))
                                    {
                                        layer.alert('纳税人识别码不能为空且必须为数字或字母');
                                        return false;
                                    }else if(!(/^[\d-]*$/.test($("#register_phone").val())))
                                    {
                                        layer.alert('注册电话只允许输入数字和中划线"-"');
                                        return false;
                                    }else if(!( /^[0-9]*$/g.test($("#bank_account").val())))
                                    {
                                        layer.alert('银行账户只允许输入数字');
                                        return false;
                                    }else{
                                        var invoiceData = {
                                            "user_id":user_id,
                                            "access_token":access_token,
                                            "title" :$("#title").val(),
                                            "credit_code" : $("#credit_code").val(),
                                            "register_address" : $("#register_address").val(),
                                            "register_phone" : $("#register_phone").val(),
                                            "bank" : $("#bank").val(),
                                            "bank_account" : $("#bank_account").val()
                                        };
                                        //console.log($("#title").val());
                                        //console.log($("#credit_code").val());
                                        //console.log(invoiceData);
                                        $.ajax({
                                            type:"POST",
                                            async:false,
                                            data: JSON.stringify(invoiceData),
                                            dataType: "json",
                                            url:api + '/api/invoice?access_token='+access_token+'&user_id='+user_id,
                                            contentType: "application/json; charset=utf-8",
                                            success:function(msg){
                                                //console.log(msg);
                                                layer.alert('保存成功');
                                            },
                                            error:function(){
                                                layer.alert('发生错误，保存失败！');
                                            }
                                        });
                                    }

                                });
                                $("#cancelbtn").click(function () {
                                    window.location.reload();
                                });
                            });

                    }

                }

            });

        });
    });
});