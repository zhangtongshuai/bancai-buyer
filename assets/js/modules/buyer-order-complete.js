require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base','layui','kkpager'],function($,template,md5,api){

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

            function getUrlParam(key) {
                // 获取参数
                var url = window.location.search;
                // 正则筛选地址栏
                var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                // 匹配目标参数
                var result = url.substr(1).match(reg);
                //返回参数值
                return result ? decodeURIComponent(result[2]) : null;
            }

            function searchFilter(pageindex){
                var pageNo = getUrlParam('pageIndex');
                if (!pageNo) {
                    pageNo = pageindex;
                }
                $.ajax({
                    url: api + '/api/order_finish_b?access_token='+access_token+'&user_id='+user_id+'&page_no='+pageNo,
                    type:'GET',
                    dataType:'json',
                    success:function(result){
                        //console.log(result);
                        var count = result.data.total;
                        var totalPage = result.data.page_total;
                        //console.log( totalPage)
                        //遮罩部分

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

                        var data=result.data.list;
                        var html=template('tpl-order-list-info',data);
                        document.getElementById('order-list-info').innerHTML=html;

                        //生成分页
                        kkpager.generPageHtml({
                            pno: pageNo,
                            //总页码
                            total : totalPage,
                            //总数据条数
                            totalRecords : count,
                            mode : 'click',
                            click : function(n){
                                this.selectPage(pageNo);
                                searchPage(n);
                                return false;
                            }
                        },true);
                    }
                });
            }
            //init
            $(function () {
                searchFilter(1)
            });
            //ajax翻页
            function searchPage(n) {
                searchFilter(n);
            }


            //左侧栏颜色改变
            $(".buyer-content .buyer-slider dl").eq(2).find("dd:nth-of-type(3)").find("a").css({"color": "#ff3c00"});
        });
    });
});