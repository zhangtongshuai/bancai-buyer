require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base','layui'],function($,template,md5,api){

        /**
         * 数据渲染
         */
        layui.use(['layer', 'form','upload'], function(){
            var layer = layui.layer
                ,form = layui.form
                ,upload = layui.upload;

            var user_id = $.cookie('user_id'),
                access_token = $.cookie('access_token');
            //
            // var user_id = 1000000003,
            //     access_token = "29cf2f3f-0368-4b5a-bcc9-3444625ca484";
            /**
             * 交互效果
             */
            //获取已付款的订单的信息

            $.ajax({
                type: 'get',
                url: api + '/api/order_pay_b?access_token='+access_token+'&user_id='+user_id,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success:function(r){
                    //console.log(r);

                    //发票信息遮罩
                    $(function(){
                        $(".billing_info_btn").click(function(){
                            $(this).parents(".order_info_list").find(".bg").fadeIn(200);
                            $(this).parents(".order_info_list").find(".content").fadeIn(400);
                        });
                        $(".bg").click(function(){
                            $(".bg").fadeOut(800);
                            $(".content").fadeOut(800);
                            $('.view_voucher').fadeOut(800);
                        });
                        $(".icon-icon-cross-solid").click(function(){
                            //关闭灰色 jQuery 遮罩
                            $(".bg").hide();
                            $(".content").hide();
                        });
                        $(".view_payment_voucher").click(function(){
                            $(this).parents(".order_info_list").find(".bg").fadeIn(200);
                            $(this).parents(".order_info_list").find(".view_voucher").fadeIn(400);
                        });
                    });

                    var data=r.data;
                    var html=template('tpl-order-list-info',data);
                    document.getElementById('order-list-info').innerHTML=html;

                    //
                    // //确认收货
                    $(".confirm_receipt_btn").click(function(){

                        $(this).parents("table").find('.icon-icon-lorry').show();

                        var orderlifo = $(this);
                        var order_id = orderlifo.parents("table").find('th span:nth-of-type(2) i').html();
                        var insertData = {
                            'order_id' :parseInt(order_id),
                        };
                        layer.open({
                            content: '您是否确认收货？'
                            ,btn: ['是', '否']
                            ,yes: function(offerData){
                                //alert(333);
                                //console.log(pur_id);
                                $.ajax({
                                    type: 'post',
                                    url : api +  '/api/order_finish?access_token='+access_token+'&user_id='+user_id,
                                    dataType: 'json',
                                    data: JSON.stringify(insertData),
                                    contentType: "application/json; charset=utf-8",
                                    success:function(finishData){
                                        //console.log(finishData);
                                        layer.alert('您已完成收货，您的评价对卖家很重要不要忘了评价', {icon: 1});
                                        orderlifo.parents("table").find(".prompt_box").html("已确认收货");
                                        orderlifo.parents("table").find(".confirm_receipt_btn").hide();
                                    }
                                });
                            },btn2: function(){
                                //按钮【按钮二】的回调
                            }
                            ,cancel: function(){
                                //右上角关闭回调
                            }
                        });
                    });
                }
            });

            //左侧栏颜色改变
            $(".buyer-content .buyer-slider dl").eq(2).find("dd:nth-of-type(2)").find("a").css({"color": "#ff3c00"});
        });
    });
});