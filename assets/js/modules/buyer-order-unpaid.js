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
            // 	access_token = "29cf2f3f-0368-4b5a-bcc9-3444625ca484";
            /**
             * 交互效果
             */
            //获取未付款的订单的信息
            $.ajax({
                type: 'get',
                url: api + '/api/order_unpay_b?access_token='+access_token+'&user_id='+user_id,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success:function(r){
                    //console.log(r);

                        //$('.complete_btn').attr("disabled",false);
                        //发票信息遮罩
                        $(function(){
                            $(".billing_info_btn").click(function(){
                                $(this).parents(".order_info_list").find(".bg").fadeIn(200);
                                $(this).parents(".order_info_list").find(".content").fadeIn(400);
                            });
                            $(".bg").click(function(){
                                $(".bg").fadeOut(800);
                                $(".content").fadeOut(800);
                            });
                            $(".icon-icon-cross-solid").click(function(){
                                //关闭灰色 jQuery 遮罩
                                $(".bg").hide();
                                $(".content").hide();
                            });
                        });
                        //发票信息
                        var data=r.data;
                        var html=template('tpl-order-list-info',data);
                        document.getElementById('order-list-info').innerHTML=html;
                        //
                        //取消订单
                        $(".cancel_order_btn").click(function(){
                            var orderlist = $(this);
                            //console.log($(this));
                            var order_id = orderlist.parents("table").find('th span:nth-of-type(2) i').html();
                            var insertData = {
                                'order_id' :parseInt(order_id),
                                'user_type': 0
                            };
                            layer.open({
                                content: '您是否确认要取消订单？'
                                ,btn: ['是', '否']
                                ,yes: function(data){
                                    $.ajax({
                                        type: 'post',
                                        url : api +  '/api/order_cancel?access_token='+access_token+'&user_id='+user_id,
                                        dataType: 'json',
                                        data: JSON.stringify(insertData),
                                        contentType: "application/json; charset=utf-8",
                                        success:function(closeData){
                                           // console.log(closeData);
                                            layer.alert('已经取消订单', {icon: 1});
                                            orderlist.parents("table").find(".cancel_order_btn").hide();
                                            orderlist.parents("table").find('.upload_voucher_btn').hide();
                                            orderlist.parents("table").find('.complete_btn').hide();
                                            orderlist.parents("table").find(".prompt_box").html("订单已取消");
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

                        //上传付款凭证
                        var pictureFile; //图片base64信息

                        $('.product-zhan-up').on('change', function(event) {
                            //获取图片的大小
                            var fileSize = this.files[0].size;
                            var orderif = $(this);
                            //对于图片的大小进行比较
                            if(fileSize > 1 * 1024 * 1024) {
                                alert("上传图片大小不能超过1M");
                                return false;
                            } else {
                                var imageUrl = getObjectURL($(this)[0].files[0]);
                                convertImgToBase64(imageUrl, function(base64Img) {
                                    pictureFile = base64Img;

                                    var product_commit_obj = {
                                        user_id: user_id,
                                        access_token: access_token,
                                        simage: pictureFile
                                    };
                                    console.log(product_commit_obj);
                                    $.ajax({
                                        type: "post",
                                        url: api+"/api/upload_image",
                                        async:true,
                                        data: JSON.stringify(product_commit_obj),
                                        dataType: 'json'
                                    }).then(function(picUploadData){
                                        //console.log(picUploadData);
                                        orderif.parents("table").find('.voucher_img').attr('src',picUploadData.data.image_url);
                                        orderif.parents("table").find('.product-zhan-up').show();
                                        layer.alert('成功保存付款凭证');
                                        orderif.parents("table").find('.upload_oint_out').show();
                                        orderif.parents("table").find('.complete_btn').attr("disabled",false);
                                        orderif.parents("table").find('.complete_btn').css({"background":"#ff9000"});

                                        //确认按钮
                                        $(".complete_btn").click(function(){

                                            //付款凭证信息
                                            var piccArr = $(this).parents("table").find('.voucher_img').attr('src');
                                            var order_id = $(this).parents("table").find('th span:nth-of-type(2) i').html();
                                            var insertData = {
                                                'order_id' :parseInt(order_id),
                                                'image_url': piccArr
                                            };
                                            //console.log(JSON.stringify(insertData));
                                            var orderbtn = $(this);
                                            //发送数据到后台
                                            $.ajax({
                                                type:"POST",
                                                async:true,
                                                data: JSON.stringify(insertData),
                                                dataType: "json",
                                                url:api+'/api/order_certificate?access_token='+ access_token +'&user_id='+ user_id,
                                                contentType: "application/json; charset=utf-8",
                                                success : function(msg){
                                                    //console.log(msg);
                                                    layer.alert('付款凭证上传成功');
                                                    orderbtn.parents("table").find('.cancel_order_btn').hide();
                                                    orderbtn.parents("table").find('.upload_voucher_btn').hide();
                                                    orderbtn.parents("table").find('.complete_btn').hide();
                                                    orderbtn.parents("table").find('.upload_oint_out').hide();
                                                    orderbtn.parents("table").find(".prompt_box").html("已上传付款凭证");
                                                },
                                                error:function(){
                                                    layer.alert('发生错误，请求数据失败！');
                                                }
                                            });

                                        });
                                    });
                                });
                                event.preventDefault();
                            }
                        });

                        //上传图片的方法
                        function convertImgToBase64(url, callback, outputFormat) {
                            var canvas = document.createElement('CANVAS');
                            var ctx = canvas.getContext('2d');
                            var img = new Image;
                            img.crossOrigin = 'Anonymous';
                            img.onload = function() {
                                var width = img.width;
                                var height = img.height;
                                // 按比例压缩4倍
                                var rate = (width < height ? width / height : height / width) / 1;
                                canvas.width = width * rate;
                                canvas.height = height * rate;
                                ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
                                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                                callback.call(this, dataURL);
                                canvas = null;
                            };
                            img.src = url;
                        }
                        function getObjectURL(file) {
                            var url = null;
                            if(window.createObjectURL != undefined) { // basic
                                url = window.createObjectURL(file);
                            } else if(window.URL != undefined) { // mozilla(firefox)
                                url = window.URL.createObjectURL(file);
                            } else if(window.webkitURL != undefined) { // web_kit or chrome
                                url = window.webkitURL.createObjectURL(file);
                            }
                            return url;
                        }

                }
            });

            //左侧栏颜色改变
            $(".buyer-content .buyer-slider dl").eq(2).find("dd:nth-of-type(1)").find("a").css({"color": "#ff3c00"});
        });
    });
});