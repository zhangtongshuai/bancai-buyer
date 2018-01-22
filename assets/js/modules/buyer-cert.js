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
			// 	access_token = "da2c29b1-0db9-434d-860d-93834ca0f576";

			//获取联系人信息
			$.ajax({
				type: 'get',
				url: api + '/api/contacts',
				data: {
					"user_id": user_id,
					"access_token": access_token
				},
				dataType: 'json',
                success:function(certData){
                	//console.log(certData);
                    if (certData.err_code == 0) {
                        if (certData.data.contacts != null) {
                            $("#buyer_cert_info").load("include/buyer-cert-modify.html",function () {
                                $("#contains-btn").val(certData.data.contacts);
                                $("#phone-btn").val(certData.data.phone_no);
                                $("#email-btn").val(certData.data.email);

                                $("#modify_btn").click(function () {
                                    if ($("#contains-btn").val() == ""|| $("#contains-btn").val() != $("#contains-btn").val().replace(/^ +| +$/g,'')) {
                                        layer.alert('联系人信息不能为空');
                                        return false;
                                    }else if ($("#phone-btn").val() == "" || !( /^1(3|4|5|7|8)\d{9}$/.test($("#phone-btn").val()))) {
                                        layer.alert('请填写正确的手机号');
                                        return false;
                                    }else if ($("#email-btn").val() == "" || !( /[_a-z\d\-\./]+@[_a-z\d\-]+(\.[_a-z\d\-]+)*(\.(info|biz|com|edu|gov|net|am|bz|cn|cx|hk|jp|tw|vc|vn))$/.test($("#email-btn").val()))) {
                                        layer.alert('请填写正确的邮箱');
                                        return false;
                                    }else{
                                        var containsObj = {
                                            user_id: user_id,
                                            access_token: access_token,
                                            contacts: $("#contains-btn").val(),
                                            phone_no: $("#phone-btn").val(),
                                            email: $("#email-btn").val()
                                        };
                                        $.ajax({
                                            type: "post",
                                            url: api + "/api/contacts",
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
                            $("#buyer_cert_info").load("include/buyer-cert-upload.html",function () {

                                $("#hold_btn").click(function () {
                                    if ($("#contains-btn").val() == ""|| $("#contains-btn").val() != $("#contains-btn").val().replace(/^ +| +$/g,'')) {
                                        layer.alert('联系人信息不能为空');
                                        return false;
                                    }else if ($("#phone-btn").val() == "" || !( /^1(3|4|5|7|8)\d{9}$/.test($("#phone-btn").val()))) {
                                        layer.alert('请填写正确的手机号');
                                        return false;
                                    }else if ($("#email-btn").val() == "" || !( /[_a-z\d\-\./]+@[_a-z\d\-]+(\.[_a-z\d\-]+)*(\.(info|biz|com|edu|gov|net|am|bz|cn|cx|hk|jp|tw|vc|vn))$/.test($("#email-btn").val()))) {
                                        layer.alert('请填写正确的邮箱');
                                        return false;
                                    }else{
                                        var containsObj = {
                                            user_id: user_id,
                                            access_token: access_token,
                                            contacts: $("#contains-btn").val(),
                                            phone_no: $("#phone-btn").val(),
                                            email: $("#email-btn").val()
                                        };
                                        $.ajax({
                                            type: "post",
                                            url: api + "/api/contacts",
                                            async:true,
                                            data: JSON.stringify(containsObj),
                                            dataType: "json",
                                            contentType: "application/json; charset=utf-8",
                                            success:function(changmsg){
                                                //console.log(changmsg);
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
			$(".buyer-content .buyer-slider dl").eq(0).find("dd:nth-of-type(3)").find("a").css({"color": "#ff3c00"});
        });
    });
});