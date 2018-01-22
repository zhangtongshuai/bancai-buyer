require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base'],function($,template,md5,api){
        
    	/**
    	 * 数据渲染
    	 */
    	var user_id = $.cookie('user_id'),
			access_token = $.cookie('access_token');
    	//
        // var user_id = 1000000006,
			// access_token = "056f4368-690a-4820-a3ef-b6238f62d713",
			// ent_name = "青岛九九网络科技有限公司";

		$.get('include/realnamecon.html', function(realdata) {
			/*optional stuff to do after success */
			var render = template.compile(realdata);

			//查看企业认证信息
			$.ajax({
				type: 'get',
				url: api + "/api/Cert_Ent",
				data: {
					"user_id": user_id,
					"access_token": access_token,
					"ent_name": null
				},
				dataType: "json"
			}).then(function(realData){
				//console.log(realData);
				if (realData.err_code == 0) {

					if (realData.data == null) {
						$(".buyer-right-bottom").css({"display": "none"});
						$(".buyer-data-null").css({"display": "block"});
					}else{
						var html = render(realData);
						$("#realnamecon").html(html);

                        if (realData.data.status != 1) {
                            $(".look1").css({"display": "block"});

                            $('.buyer-right-bottom .look1').on('click', function(){
                                $.cookie('tz', '0', {path: '/', domain: 'bancai.com'});
                                window.location.href = 'http://www.bancai.com/identification_one.html';
                            });

                        }else{
                            $(".look1").css({"display": "none"});
                        }
                        if (realData.data.status == 2) {
                            $("#hintInfo1").html("审核未通过："+realData.audit_msg);
                        }
                        if (realData.data.status == 0) {
                            $("#hintInfo1").html("您已经提交审核，工作人员会在一个工作日内审核您提交的认证信息");
                        }
                        if (realData.data.status == 1) {
                            $("#hintInfo1").html("您已经通过企业实名认证");
                        }

						$(".buyer-right-bottom div").eq(11).find("span").eq(1).on("click", function(){
							window.open(realData.data.cert_img);
						});
					}
				}else{
					$(".buyer-right-bottom").css({"display": "none"});
					$(".buyer-data-null").html("系统出现异常").css({"display": "block"});
				}
			});
		});

		$.get("include/realnameper.html", function(realperdata){
			var render = template.compile(realperdata);

			// var user_id = 1000000003,
			// 	access_token = "da2c29b1-0db9-434d-860d-93834ca0f576";
			
			//查看个人认证信息
			$.ajax({
				type: "get",
				url: api + "/api/Cert_User",
				data: {
					"user_id": user_id,
					"access_token": access_token
				},
				dataType: "json"
			}).then(function(personData){
				//console.log(personData);
				if (personData.err_code == 0) {

					if (personData.data == null) {
						$(".buyer-right-bottom-p").css({"display": "none"});
						$(".buyer-data-null-person").css({"display": "block"});
					}else{

						var html = render(personData);
						$("#realnameper").html(html);

                        if (personData.data.status != 1) {
                            $(".look2").css({"display": "block"});

                            $('.buyer-right-bottom-p .look2').on('click', function(){
                                $.cookie('tz', '0', {path: '/', domain: 'bancai.com'});
                                window.location.href = 'http://www.bancai.com/identification_one.html';
                            });

                        }else{
                            $(".look2").css({"display": "none"});
                        }
                        if (personData.data.status == 2) {
                            $("#hintInfo2").html("审核未通过："+personData.audit_msg);
                        }
                        if (personData.data.status == 0) {
                            $("#hintInfo2").html("您已经提交审核，工作人员会在一个工作日内审核您提交的认证信息");
                        }
                        if (personData.data.status == 1) {
                            $("#hintInfo2").html("您已经通过个人实名认证");
                        }

						$(".buyer-right-bottom-p div").eq(2).find("span").eq(1).on("click", function(){
							window.open(personData.data.id_card_img);
						});
					}
				}else{
					$(".buyer-right-bottom-p").css({"display": "none"});
					$(".buyer-data-null-person").html("系统出现异常").css({"display": "block"});
				}
			});
		});
    	/**
    	 * 交互效果
    	 */
		//左侧栏颜色改变
		$(".buyer-content .buyer-slider dl").eq(0).find("dd:nth-of-type(6)").find("a").css({"color": "#ff3c00"});

        $('.buyer-data-null button,.buyer-data-null-person button').on('click', function(){
            $.cookie('tz', '0', {path: '/', domain: 'bancai.com'});
            window.location.href = 'http://www.bancai.com/identification_one.html';
        });

    });
});