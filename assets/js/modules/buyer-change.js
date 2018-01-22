require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base'],function($,template,md5,api){
        
    	/**
    	 * 数据渲染
    	 */
        var user_id = $.cookie('user_id'),
			access_token = $.cookie('access_token');
		//网络请求带参数
//		var user_id = 1000000003,
//			access_token = "da2c29b1-0db9-434d-860d-93834ca0f576";
    	/**
    	 * 交互效果
    	 */
    	//所有的全局变量
        var oldPsw,//获取原密码输入框的内容
			newPsw,//获取新密码输入框的内容
			reNewPsw,//获取确认密码输入框的内容
			phone,//获取手机输入框的内容
			phoneMsg,//获取短信验证码输入框的内容
			randomMsg;//保存6位随机数字
        
		//原始密码随便填,只要格式正确
		//输入框校对
		//输入原始密码
		$("#old-psw").on("blur", function(){
			var oldPswVal = $(this).val();
			var oldPswReg = /^(?!^[0-9]*$)(?!^[a-zA-Z]*$)(?!^[^a-zA-Z0-9]*$)\S{6,25}$/;
			if (!(oldPswReg.test(oldPswVal))) {
				$("#old-psw + small").html("输入的密码格式不正确");
			}else{
				$("#old-psw + small").html("");
			}
		});
		//输入新密码
		$("#new-psw").on("blur", function(){
			var newPswVal = $(this).val();
			var newPswReg = /^(?!^[0-9]*$)(?!^[a-zA-Z]*$)(?!^[^a-zA-Z0-9]*$)\S{6,25}$/;
			if (!(newPswReg.test(newPswVal))) {
				$("#new-psw + small").html("输入的密码格式不正确");
			}else{
				$("#new-psw + small").html("");
			}
		});
		//确认输入新密码
		$("#re-new-psw").on("blur", function(){
			var newPswValr = $(this).val();
			var newPswRegr = /^(?!^[0-9]*$)(?!^[a-zA-Z]*$)(?!^[^a-zA-Z0-9]*$)\S{6,25}$/;
			if (!(newPswRegr.test(newPswValr))) {
				$("#re-new-psw + small").html("输入的密码格式不正确");
			}else{
				$("#re-new-psw + small").html("");
			}
		});
		//手机号
		$("#phone").on("blur", function(){
			var phoneValr = $(this).val();
			var phoneRegr = /^1(3|4|5|7|8)\d{9}$/;
			if (!(phoneRegr.test(phoneValr))) {
				$("#phone + small").html("输入的手机号格式不正确");
			}else{
				$("#phone + small").html("");
			}
		});
		
		//监听短信验证码输入框
		$("#phone-msg").on("input propertychange", function(){
			var phoneMsgLen = $(this).val().length;
			
			if (phoneMsgLen == 6) {
				$("#change-psw-submit").css({"background-color": "#ff3c00"});
				$("#change-psw-submit").on("click", phoneSubmit);
			}
		});
		
		
		//点击获取短信验证码
		$("#msg-btn").on("click", function(){
			randomMsg = Math.random().toFixed(6).split(".")[1];
			var phone = $("#phone").val();
			if("" == phone || !(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
				return false;
			}
			phoneMsgChoose(this, 180, randomMsg);
		});
		
		
		function phoneSubmit(){
			oldPsw = $("#old-psw").val();
			newPsw = $("#new-psw").val();
			reNewPsw = $("#re-new-psw").val();
			phone = $("#phone").val();
			phoneMsg = $("#phone-msg").val();
			if ("" == oldPsw.trim()) {
				$("#old-psw + small").html("原始密码不能为空");
			}else if ("" == newPsw.trim()) {
				$("#new-psw + small").html("新密码不能为空");
			}else if ("" == reNewPsw.trim() || newPsw != reNewPsw) {
				$("#re-new-psw + small").html("两次输入的密码不一致");
			}else if ("" == phone || !(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
				$("#phone + small").html("手机号格式不正确");
			}else if ("" == phoneMsg.trim() || phoneMsg != randomMsg) {
				$("#msg-btn + small").html("验证码不正确");
			}else {
				oldPsw = md5(oldPsw);
				newPsw = md5(newPsw);
				var submitObj = {
					"access_token": access_token,
					"user_id": user_id,
					"pwd_old": oldPsw,
					"pwd_new": newPsw,
					"type": "1"
				};
				$.ajax({
					type: "post",
					url: api + "/api/Chg_Pwd",
					data: JSON.stringify(submitObj),
					dataType: "json"
				}).then(function(changePwd){
					if (changePwd.err_code == -1) {
						$(".change-err").html(changePwd.msg);
					}else if (changePwd.err_code == 0) {
						phoneSubmitSuccess();
					}
				});
			}
		}
		
		//提交成功后
		function phoneSubmitSuccess(){
			$(".buyer-right-bottom").css({"display": "none"});
			$(".change-success").css({"display": "block"});
			$("#change-success-btn").css({"cursor": "pointer"}).on("click", function(){
				$.cookie("user_name", '', { expires: -1, path:'/', domain: "bancai.com"});
	        	$.cookie("access_token", '', { expires: -1, path:'/', domain: "bancai.com"});
	        	$.cookie("user_id", '', { expires: -1, path:'/', domain: "bancai.com"});
				window.location.href = "http://www.bancai.com/login_buyer.html?usertype=0";
			});
		}	
		//点击获取验证码判断
		function phoneMsgChoose(that, time, randomMsg){	
			oldPsw = $("#old-psw").val();
			newPsw = $("#new-psw").val();
			reNewPsw = $("#re-new-psw").val();
			phone = $("#phone").val();
			if ("" == oldPsw) {
				$("#old-psw + small").html("原始密码不能为空");
			}else if ("" == newPsw) {
				$("#new-psw + small").html("新密码不能为空");
			}else if ("" == reNewPsw) {
				$("#re-new-psw + small").html("两次输入的密码不一致");
			}else if ("" == phone || !(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
				$("#phone + small").html("手机号格式不正确");
			}else{
				$.ajax({
					type: 'get',
					url: api + "/api/sms_code",
					contentType: "application/json; charset=utf-8",
					data: {
						"access_token": access_token,
						"user_id": user_id,
						"phone_no": phone,
						"ver_code": randomMsg
					},
					dataType: 'json'
				}).then(function(phoneData){
					if(phoneData.err_code == 2001){
						$("#phone + small").html(phoneData.msg);
						return false;
					}else if(phoneData.err_code == 2002){
						$("#phone + small").html(phoneData.msg);
						return false;
					}
				});
				phoneMsgFn(that,time);
			}
		}
		
		//获取验证码倒计时方法
		function phoneMsgFn(that,time){
			$(that).addClass("on").html("重新发送(180s)");
			$(that).off("click");
			var reTime = time;//倒计时
			var timer = setInterval(() => {
				if (reTime > 1) {
					reTime--;
					$(that).html("重新发送("+reTime+")s");
				}else{
					$(that).removeClass("on").html("获取验证码");
					$(that).on("click", function(){
						phoneMsgFn(this,180);
					});
					clearInterval(timer);
				}
			}, 1000);
		}
		
		//左侧栏颜色改变
		$(".buyer-content .buyer-slider dl").eq(0).find("dd:nth-of-type(7)").find("a").css({"color": "#ff3c00"});
    });
});