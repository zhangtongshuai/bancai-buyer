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
    	$.get("include/level.html", function(levelmsgData){
    	 	var render = template.compile(levelmsgData);
    	 	
			//获取公司信息
			$.ajax({
				type: 'get',
				url: api + '/api/Integral',
				data: {
					"user_id": user_id,
					"access_token": access_token
				},
				dataType: 'json'
			}).then(function(levelData){
				//console.log(levelData);
				if (levelData.err_code == 0) {
					if (levelData.data != null) {
						var html = render(levelData);
						$("#levelmsg").html(html);
					}
				}
			});
    	});
    	/**
    	 * 交互效果
    	 */
		//左侧栏颜色改变
		$(".buyer-content .buyer-slider dl").eq(0).find("dd:nth-of-type(2)").find("a").css({"color": "#ff3c00"});
    });
});