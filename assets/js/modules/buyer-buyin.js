require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base'],function($,template,md5,api){
        /**
         * 数据渲染
         */
        var user_id = $.cookie('user_id'),
            access_token = $.cookie('access_token');
        //
        // var user_id = 1000000003,
        //     access_token = "adf7c99e-a16c-4e75-b8a0-3c43314bac90";
        //左侧栏颜色改变
        $(".buyer-content .buyer-slider dl").eq(1).find("dd:nth-of-type(2)").find("a").css({"color": "#ff3c00"});
            //获取发布中的求购单信息
            $.ajax({
                type: 'get',
                url: api + '/api/purchase_bg?access_token='+access_token+'&user_id='+user_id+'&status=0',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success:function(r){
                    //console.log(r);
                    var data=r.data;
                    var html=template('tpl-order-list-info',data);
                    document.getElementById('order-list-info').innerHTML=html;
                }
            });

    });
});