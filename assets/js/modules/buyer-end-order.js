require(['../common/common'],function(c){
    require(['jquery','template','md5','global','jquery.cookie','slider','base','kkpager'],function($,template,md5,api){
        /**
         * 数据渲染
         */
        /**
         * 请求数据以及分页展示
         */

        //获取发布中的求购单信息

        var user_id = $.cookie('user_id'),
            access_token = $.cookie('access_token');
        //
        // var user_id = 1000000003,
        //     access_token = "adf7c99e-a16c-4e75-b8a0-3c43314bac90";
        //左侧栏颜色改变
        $(".buyer-content .buyer-slider dl").eq(1).find("dd:nth-of-type(3)").find("a").css({"color": "#ff3c00"});
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
                url: api + '/api/purchase_bg?access_token='+access_token+'&user_id='+user_id+'&status=1&page_no='+pageNo,
                type:'GET',
                dataType:'json',
                success:function(result){
                    //console.log(result);
                    var count = result.data.total;
                    var totalPage = result.data.page_total;
                    //console.log( totalPage)
                    var data = result.data.list;
                    var html=template('tpl-sxlistcon',data);
                    document.getElementById('sx-listcon').innerHTML = html;
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
    });
});