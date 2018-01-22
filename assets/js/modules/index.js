require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','layui','slider','base'],function($,template,md5,api){
        
    	/**
    	 * 数据渲染
    	 */
    	var user_id = $.cookie('user_id'),
			access_token = $.cookie('access_token');
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
			dataType: 'json'
		}).then(function(certData){
			if (certData.err_code == 0) {
				if (certData.data != null) {
					$("#contains-btn").val(certData.data.contacts);
					$("#phone-btn").val(certData.data.phone_no);
					$("#email-btn").val(certData.data.email);
				}else{
					$("#contains-btn").focus();
				}
			}else{
				layer.alert('网络请求失败');
			}
		});
		
    	/**
    	 * 交互效果
    	 */
		//左侧栏颜色改变
		
    });
});