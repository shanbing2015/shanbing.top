
(function($){
	function save(url,data){
		var postUrl = window.location.pathname;
		var siteUrl = window.location.host;
		var saveData = 
			{
				"siteUrl":siteUrl,             					/* 站点地址 */
				"postUrl":postUrl,      						/* 帖子地址 */
				"commentName":data.replyName,                   /* 评论者名称 */
				"commentContacts":"",    						/* 联络方式 */
				"commentContent":data.content               	/* 回复内容 */
			};
		console.log("saveComment:"+saveData);
	
		$.ajax({
			type : "POST",
			url : url,
			async:false,
			cache:false,
            data : JSON.stringify(saveData),
            contentType : "application/json",
            dataType : "json",
            complete:function(msg) {
				console.log(msg);
            },
			error:function(msg){
				
			}
        });
	}
	
	function list(url,pageSize,pageNum){
		var result;
		var postUrl = window.location.pathname;
		var siteUrl = window.location.host;
		var listdata = 
			{
				"siteUrl":siteUrl,             					/* 站点地址 */
				"postUrl":postUrl,      						/* 帖子地址 */
				"pageSize":pageSize,                   			/* 页大小,默认10 */
				"pageNum":pageNum    							/* 页码 */
				
			};
	
		$.ajax({
			type : "POST",
			url : url,
			async:false,
			cache:false,
            data : JSON.stringify(listdata),
            contentType : "application/json",
            dataType : "json",
            success:function(msg) {				
				result = msg;				
            },
			error:function(msg){
				console.log(msg);
				alert(msg);
			}
        });
		return result;
	}
	
	function crateCommentInfo(obj){
		if(typeof(obj.time) == "undefined" || obj.time == ""){
			obj.time = getNowDateFormat();
		}

		var address = "";
		var osname = "";
		/*
		 if(typeof(obj.address) != "undefined" && obj.browse != ""){
			address ="<span><i class='glyphicon glyphicon-map-marker'></i>"+obj.address+"</span>";
		}

		if(typeof(obj.osname) != "undefined" && obj.osname != ""){
			osname ="<span><i class='glyphicon glyphicon-pushpin'></i> 来自:"+obj.osname+"</span>";
		}
		if(typeof(obj.browse) != "undefined" && obj.browse != ""){
			el = el + "<span><i class='glyphicon glyphicon-globe'></i> "+obj.browse+"</span>";
		}
		*/
		
		var el = "<div class='comment-info'>"+
					"<header><img src='"+obj.img+"'></header>"+
					"<div class='comment-right'>"+
						"<h3>"+obj.replyName+"</h3>"+
						/*"<div class='comment-content-header'>"+
							"<span><i class='glyphicon glyphicon-time'></i>"+obj.time+"</span>"+
							address+
						"</div>"+*/
						"<p class='content'>"+obj.content+"</p>"+
						"<div class='comment-content-footer'>"+
							"<div class='row'><div class='col-md-10'>"+
							obj.time+
						"</div>"+
						/*"<div class='col-md-2'><span class='reply-btn'>回复</span></div>"+*/
					"</div>"+
				  "</div>"+
				  "<div class='reply-list'>";
		/*if(obj.replyBody != "" && obj.replyBody.length > 0){
			var arr = obj.replyBody;
			for(var j=0;j<arr.length;j++){
				var replyObj = arr[j];
				el = el+createReplyComment(replyObj);
			}
		}*/
		el = el+"</div></div></div>";
		return el;
	}
	
	//返回每个回复体内容
	function createReplyComment(reply){
		var replyEl = "<div class='reply'><div><a href='javascript:void(0)' class='replyname'>"+reply.replyName+"</a>:<a href='javascript:void(0)'>@"+reply.beReplyName+"</a><span>"+reply.content+"</span></div>"
						+ "<p><span>"+reply.time+"</span> <span class='reply-list-btn'>回复</span></p></div>";
		return replyEl;
	}
	function getNowDateFormat(){
		var nowDate = new Date();
		var year = nowDate.getFullYear();
		var month = filterNum(nowDate.getMonth()+1);
		var day = filterNum(nowDate.getDate());
		var hours = filterNum(nowDate.getHours());
		var min = filterNum(nowDate.getMinutes());
		var seconds = filterNum(nowDate.getSeconds());
		return year+"-"+month+"-"+day+" "+hours+":"+min+":"+seconds;
	}
	function filterNum(num){
		if(num < 10){
			return "0"+num;
		}else{
			return num;
		}
	}
	function replyClick(el){
		el.parent().parent().append("<div class='replybox'><textarea cols='80' rows='50' placeholder='来说几句吧......' class='mytextarea' ></textarea><span class='send'>发送</span></div>")
		.find(".send").click(function(){
			var content = $(this).prev().val();
			if(content != ""){
				var parentEl = $(this).parent().parent().parent().parent();
				var obj = new Object();
				obj.replyName="匿名";
				if(el.parent().parent().hasClass("reply")){
					console.log("1111");
					obj.beReplyName = el.parent().parent().find("a:first").text();
				}else{
					console.log("2222");
					obj.beReplyName=parentEl.find("h3").text();
				}
				obj.content=content;
				obj.time = getNowDateFormat();
				var replyString = createReplyComment(obj);
				$(".replybox").remove();
				parentEl.find(".reply-list").append(replyString).find(".reply-list-btn:last").click(function(){alert("不能回复自己");});
			}else{
				alert("空内容");
			}
		});
	}

	$.fn.addCommentList=function(options){
		var defaults = {
			data:[{id:1,img:"https://www.shanbing.top/assets/images/img.jpg",replyName:"admin",content:"TSET",time:"2018-06-26 00:00:00"}],
			add:"",
			url: "https://www.shanbing.top/api/comment/v1/",
			pageSize: 10,
			pageNum: 1
		}
		var option = $.extend(defaults, options);
		if(option.add == ""){
			var lists = list(option.url+"list",option.pageSize,option.pageNum);
			//console.log(lists);
			if(lists.errcode == 0){
				for(var i=0;i<lists.data.list.length;i++){
					var obj = lists.data.list[i];
					var addObj = {
						id:obj.commentId,
						img:"https://www.shanbing.top/assets/images/img.jpg",
						replyName:obj.commentName,
						time:obj.commentDate,
						content:obj.commentContent
					};
					option.data.push(addObj);
				}
			}
		}
		//加载数据
		if(option.data.length > 0){
			var dataList = option.data;
			var totalString = "";
			for(var i=0;i<dataList.length;i++){
				var obj = dataList[i];
				var objString = crateCommentInfo(obj);
				totalString = totalString+objString;
			}
			$(this).append(totalString).find(".reply-btn").click(function(){
				if($(this).parent().parent().find(".replybox").length > 0){
					$(".replybox").remove();
				}else{
					$(".replybox").remove();
					replyClick($(this));
				}
			});
			$(".reply-list-btn").click(function(){
				if($(this).parent().parent().find(".replybox").length > 0){
					$(".replybox").remove();
				}else{
					$(".replybox").remove();
					replyClick($(this));
				}
			})
		}
		
		//添加新数据
		if(option.add != ""){
			save(option.url+"save",option.add);
			
			obj = option.add;
			var str = crateCommentInfo(obj);
			$(this).prepend(str).find(".reply-btn").click(function(){
				replyClick($(this));
			});
		}
	}
	
	
	
})(jQuery);