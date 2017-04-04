function getFileName(o){
	var pos=o.lastIndexOf(".");
	return o.substring(0,pos);
}
module.exports=function(grunt){
	require("time-grunt")(grunt);
	grunt.initConfig({
		pkg      :grunt.file.readJSON("package.json"),
		//PUBLIC
		publicDir:"dist",
		pubCss   :"dist/css",
		pubJs    :"dist/js",
		pubJsm   :"dist/js/jsmin",
		pubHtml  :"dist/html",
		pubImg   :"dist/img",
		//SRC
		personDir:"src",
		pplCss   :"src/css",
		pplSass  :"src/sass",
		pplJs    :"src/js",
		pplHtml  :"src/html",
		pplImg   :"src/img",
		//检查dist/css内的css文件
		csslint  :{
			options :{
				csslintrc:".csslintrc.json"
			},
			checkCss:{
				options:{
					import:2
				},
				src    :["<%= pubCss %>/*.css"]
			}
		},
		//compileSass
		sass     :{
			compileSass:{
				files  :[{
					expand:true,
					cwd   :"<%= pplSass %>",
					src   :["**/*.scss"],
					dest  :"<%= pplCss %>",
					ext   :".css"
				}],
				options:{
					style:"expanded"
				}
			}
		},
		//minCss
		cssmin   :{
			minCss :{
				files:[{
					expand:true,
					cwd   :"<%= pplCss %>",
					src   :["*.css"],
					dest  :"<%= pubCss %>",
					ext   :".min.css"
				}]
			}
		},
		//CheckJS
		jshint   :{
			options:{
				jshintrc:".jshintrc.json"
			},
			chk1   :["<%= pplJs %>/*.js"],
			chk2   :["Gruntfile.js"]
		},
		//minJS
		uglify   :{
			options   :{
				stripBanners:true,
				banner      :"/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today('yyyy-mm-dd HH:MM') %> */\n"
			},
			compressJS:{
				files:[{
					expand:true,
					cwd   :"<%= pplJs %>",
					src   :"**/*.js",
					dest  :"<%= pubJs %>",
					ext   :".min.js"
				}]
			}
		},
		//Monitor
		watch    :{
			options:{
				dateFormat:function(){
					grunt.log.writeln((new Date()).toString());
					grunt.log.writeln("Waiting...");
				}
			},
			minJS  :{
				files:["<%= pplJs %>/*.js"],
				tasks:["uglify"]
				//options:{
				//	spawn:false
				//}
			},
			sass   :{
				files:["<%= pplSass %>/*.scss"],
				tasks:["sass"]
			},
			minCss :{
				files:["<%= pplCss %>/*.css"],
				tasks:["cssmin"]
				//options:{
				//	spawn:false
				//}
			}
		}
	});
	require("load-grunt-tasks")(grunt,{scope:"devDependencies"});
	
	/*同步删除*/
	var delFile;
	//"dist/js/"=distpath
	//filepath="src/js/*.js"=watchpath
	//"src/js/"=prewatchpath
	delFile=function(distpath,watchpath,prewatchpath){
		//fileName.js
		var file=watchpath.substring(prewatchpath.length);
		//fileName
		var fileN=getFileName(file);
		if(watchpath.substr(-2)==="js"){
			//*.min.js
			var minjsN=fileN+".min.js";
			var minJs;
			//dist/js/*.min.js
			minJs=distpath+minjsN;
			if(grunt.file.exists(minJs)){
				grunt.file.delete(minJs);
				return;
			}
		}else if(watchpath.substr(-4)==="scss"){
			var cssFileN  =fileN+".css";
			var cssFileM  =fileN+".css.map";
			var cssFileMin=fileN+".min.css";
			var cssFile,cssMap,cssMin;
			//src/css/*.css
			cssFile="src/css/"+cssFileN;
			//src/css/*.css.map
			cssMap="src/css/"+cssFileM;
			//dist/css/*.min.css
			cssMin=distpath+cssFileMin;
			if(grunt.file.exists(cssFile)){
				grunt.file.delete(cssFile);
				grunt.file.delete(cssMap);
				grunt.file.delete(cssMin);
				return;
			}
		}else if(watchpath.substr(-3)==="css"){
			var cssFileMin=fileN+".min.css";
			var cssMin;
			//dist/css/*.min.css
			cssMin=distpath+cssFileMin;
			if(grunt.file.exists(cssMin)){
				grunt.file.delete(cssMin);
				return;
			}
		}
	};
	grunt.event.on("watch",function(action,filepath,target){
		//grunt.log.writeln(target+": "+filepath+" 已经 "+action);
		//grunt.log.writeln(filepath.substr(-2));
		//grunt.log.writeln(filepath.substr(-4));
		if(target==="minJS"){
			//filepath=src/js/*.js
			if(action==="deleted"||action==="renamed"){
				//删除dist/js/*.js
				delFile("dist/js/",filepath,"src/js/");
				//删除的话则
				if(action==="deleted"){
					return;
				}
			}
		}else if(target==="sass"){
			//filepath=src/sass/*.scss
			if(action==="deleted"||action==="renamed"){
				//删除dist/sass/*.scss
				delFile("dist/css/",filepath,"src/sass/");
				//删除的话则
				if(action==="deleted"){
					return;
				}
			}
		}else if(target==="minCss"){
			//filepath=src/css/*.css
			if(action==="deleted"||action==="renamed"){
				//删除dist/css/*.min.css
				delFile("dist/css/",filepath,"src/css/");
				//删除的话则
				if(action==="deleted"){
					return;
				}
			}
		}
	});
	
	// 配置grunt命令启动时，要执行的任务，这里注意先后顺序。
	//grunt.registerTask("default",["sass","cssmin","uglify","watch"]);
	grunt.registerTask("default",["sass","watch"]);
};

