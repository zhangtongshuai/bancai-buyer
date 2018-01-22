/**
 * 网站公用js
 */
require(['../common/common'],function(c){
    require(['jquery', 'global', 'jquery.cookie'],function($, api){
       
    	/**
    	 * 公用效果
    	 */
        var user_id = $.cookie('user_id'),
			access_token = $.cookie('access_token');
        //
        if (typeof $.cookie('user_name') == 'undefined') {
            $('.user-top .user-info li:eq(0) a').html('请登录');
            $(document).on('click', function(){
                window.location.href = "http://www.bancai.com/login_buyer.html?usertype=0";
            });
        }else {
            //移入到“你好”标签显示退出登录
            $('.user-top .user-info li:eq(0)').hover(function(){
                $(this).children('div').css({'display': 'block'});
            },function(){
                $(this).children('div').css({'display': 'none'});
            });
        }
    	//分类选择模拟
       $(".select_box").click(function(event){   
            event.stopPropagation();
            $(this).find(".option").toggle();
            $(this).parent().siblings().find(".option").hide();
        });
        $(document).click(function(event){
            var eo=$(event.target);
            if($(".select_box").is(":visible") && eo.attr("class")!="option" && !eo.parent(".option").length)
            $('.option').hide();                                      
        });
        /*赋值给文本框*/
        $(".option a").click(function(){
            var value=$(this).text();
            $(this).parent().siblings(".select_txt").text(value);
            $("#select_value").val(value)
        })
        // 头部地区根据ip获取
        $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(_result) {
            if (remote_ip_info.ret == '1') {
                $('.user-position').find('span').text(remote_ip_info.city);
            } 
        });

        //点击退出按钮
        $('.user-top .user-info div').on('click', function(){
            $.cookie("user_name", '', { expires: -1, domain: "www.bancai.com"});
            $.cookie("access_token", '', { expires: -1, domain: "www.bancai.com"});
            $.cookie("user_id", '', { expires: -1, domain: "www.bancai.com"});
            window.location.href = 'http://www.bancai.com/login_buyer.html?usertype=0';
        });

		//消息数量
		var hSpan = $(".header-top-box h2").eq(1).find("span").text(),//获取消息右上角元素内容
			mcartNum = $(".header-top-box .m-cart span").text();//获得购物车右上角元素内容
        //消息和购物车右上角的数量显示隐藏
		if (parseInt(hSpan) != 0) {
			$(".header-top-box h2").eq(1).find("span").css({"visibility": 'visible'});
			if (parseInt(hSpan) >= 100) {
				$(".header-top-box h2").eq(1).find("span").text('99');
			}
		}
		if (parseInt(mcartNum) != 0) {
			$(".header-top-box .m-cart span").css({"display": 'inline-block'});
			if (parseInt(mcartNum) >= 100) {
				$(".header-top-box .m-cart span").text('99');
			}
		}

        // 二维码显示隐藏
        $(".buyer-header .user-info li").eq(3).mouseenter(function(){
        	$(this).find("img").removeClass("hideen");
        }).mouseleave(function(){
        	$(this).find("img").addClass("hideen");
        });

		//搜索功能
        $('.search-btn').click(function(){
            var key=$('.select-txt').val();
            if($('#select_value').val()=="商家"){
                if(key==''){
                    window.location.reload();
                }else {
                    window.location.href='http://s.bancai.com/s_seller.html?key='+key;
                }
            }else {
                if(key==''){
                    window.location.reload();
                }else{
                    window.location.href='http://s.bancai.com/s_goods.html?key='+key;
                }
            }
        });
		//首页消息标识
		$('.header-top-box h2').eq(0).find('a').css({'border-bottom': '2px solid #fff'});
		
        //获取用户信息
        // var user_id = 1000000003,
        //     access_token = "29cf2f3f-0368-4b5a-bcc9-3444625ca484";

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
					$('.user-info').find('span').html(userData.data.user_name);
				}
			}
		});
    });
});