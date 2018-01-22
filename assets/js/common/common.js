requirejs.config({
    paths:{
    	'template':'../lib/template',
        'jquery':'../lib/jquery.min',
        'base':'../modules/base',
        'jquery.lazyload':'../lib/jquery.lazyload.min',
        'slider':'../lib/slider',
        'jquery.validate':'../lib/jquery.validate.min',
		'md5':'../lib/md5.min',
		'jquery.cookie':'../lib/jquery.cookie',
        'area':'../lib/area',
		'global':'../modules/global',
        'layui':'../lib/layui',
        'kkpager':'../lib/kkpager'
    },
    shim: {
    	"slider": {
    		deps: ['jquery']
    	}
    }
});