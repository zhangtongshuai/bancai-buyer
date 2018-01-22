require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base'],function($,template,md5,api){
        
    	/**
    	 * 数据渲染
    	 */
    	var user_id = $.cookie('user_id'),
			access_token = $.cookie('access_token');
    	//
        // var user_id = 1000000003,
			// access_token = "da2c29b1-0db9-434d-860d-93834ca0f576";
		//
    	$.get("include/usermsg.html", function(usermsgData){
    	 	var render = template.compile(usermsgData);
    	 	
			//获取用户信息
			$.ajax({
				type: 'get',
				url: api + '/api/User_Info',
				data: {
					"user_id": user_id,
					"access_token": access_token
				},
				dataType: 'json'
			}).then(function(userData){
				//console.log(userData);
				if (userData.err_code == 0) {
					if (userData.data != null) {
						var html = render(userData);
						$("#usermsg").html(html);
					}
				}
			});
    	});
    	/**
    	 * 交互效果
    	 */
		//左侧栏颜色改变
		$(".buyer-content .buyer-slider dl").eq(0).find("dd:nth-of-type(1)").find("a").css({"color": "#ff3c00"});
    });
});