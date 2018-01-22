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

			$.get("include/company.html", function(companymsgData){
				var render = template.compile(companymsgData);
				//
				// var user_id = 1000000003,
				// 	access_token = "da2c29b1-0db9-434d-860d-93834ca0f576",
				// 	ent_name = "青岛九九网络科技有限公司";
				//
				//获取公司信息
				$.ajax({
					type: 'get',
					url: api + '/api/Ent_Info?access_token='+access_token+'&user_id='+user_id+'&ent_name=',
					dataType: 'json'
				}).then(function(companyData){
					//console.log(companyData);
					if (companyData.err_code == 0) {
						if (companyData.data != null) {
							var html = render(companyData);
							$("#companymsg").html(html);
						}
					}else{
						layer.alert(companyData.msg);
					}
				});
			});
        });
    	/**
    	 * 交互效果
    	 */
		//左侧栏颜色改变
		$(".buyer-content .buyer-slider dl").eq(0).find("dd:nth-of-type(5)").find("a").css({"color": "#ff3c00"});
    });
});