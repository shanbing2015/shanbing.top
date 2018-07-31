(function($){
	function save(url,data){
		var result;
		var postUrl = window.location.pathname;
		var siteUrl = window.location.host;
		var saveData = 
			{
				"siteUrl":siteUrl,             					/* 站点地址 */
				"postUrl":postUrl,      						/* 帖子地址 */
				"commentName":data.replyName,                   /* 评论者名称 */
				"commentContacts":"",    						/* 联络方式 */
				"commentContent":data.content,               	/* 回复内容 */
				"beReplyId":data.beReplyId,						/* 被回复id*/
				"parentId":data.parentId
			};
	
		$.ajax({
			type : "POST",
			url : url,
			async:false,
			cache:false,
            data : JSON.stringify(saveData),
            contentType : "application/json",
            dataType : "json",
            success:function(data){
				console.log("获取到的数据:"+data);
				result = data;
			},
            complete:function(XMLHttpRequest,textStatus) {
						
            },
			error:function(XMLHttpRequest, textStatus){
				console.log(XMLHttpRequest);  //XMLHttpRequest.responseText    XMLHttpRequest.status   XMLHttpRequest.readyState
				console.log(textStatus);            
			}
        });
		return result;
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
			success:function(data){
				console.log("获取到的数据:"+data);
				result = data;
			},
            complete:function(XMLHttpRequest,textStatus) {
						
            },
			error:function(XMLHttpRequest, textStatus){
				console.log(XMLHttpRequest);  //XMLHttpRequest.responseText    XMLHttpRequest.status   XMLHttpRequest.readyState
				console.log(textStatus);            
			}
        });
		return result;
	}
	
	
	function crateCommentInfo(obj){
		if(typeof(obj.time) == "undefined" || obj.time == ""){
			obj.time = getNowDateFormat();
		}	
		
		var el = "<div class='comment-info'>"+
					"<header><img src='"+obj.img+"'></header>"+
					"<div class='comment-right'>"+
						"<span class='id' hidden>"+obj.id+"</span>"+
						"<h4>"+obj.replyName+"</h4>"+
						"<p class='content'>"+obj.content+"</p>"+
						"<div class='comment-content-footer'>"+
							"<div><span>"+obj.time+"</span><span class='reply-btn' style='float:right'>回复</span></div>"+
						"</div>"+
					"<div class='reply-list'>";
		if(obj.replyBody != "" && obj.replyBody.length > 0){
			var arr = obj.replyBody;
			for(var j=0;j<arr.length;j++){
				var replyObj = arr[j];
				el = el+createReplyComment(replyObj);
			}
		}
		el = el+"</div></div></div>";
		return el;
	}
	
	//返回每个回复体内容
	function createReplyComment(reply){
		var replyEl = "<div class='reply'>"+
						"<div>"+
							"<span class='id' hidden>"+reply.id+"</span>"+
							"<span class='replyname'><b>"+reply.replyName+"</b></span><span>回复<b>"+reply.beReplyName+"</b></span>:"+
							"<p>"+reply.content+"</p>"+
						"</div>"+
						"<p style='margin:0px'><span>"+reply.time+"</span> <span class='reply-list-btn' style='float:right'>回复</span></p>"+
					   "</div>";
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
	
	// 回复
	function replyClick(el){
		el.parent().parent().append("<div class='replybox' style='margin: 0em 0em 2em 0em'><textarea placeholder='来说几句吧' class='mytextarea' ></textarea><span class='send' style  = 'float:left;margin: 0px 0px 0px 10px'>发送</span></div>")
		.find(".send").click(function(){
			var content = $(this).prev().val();
			if(content != ""){
				var parentEl = $(this).parent().parent().parent().parent();
				var obj = new Object();
				obj.replyName="匿名";
				obj.parentId = parentEl.find("span:first").text();
				if(el.parent().parent().hasClass("reply")){					
					obj.beReplyName = el.parent().parent().find("b:first").text();
					obj.beReplyId = el.parent().parent().find("span:first").text();
				}else{					
					obj.beReplyName=parentEl.find("h4").text();
					obj.beReplyId = parentEl.find("span:first").text();
				}
				obj.content=content;
				obj.time = getNowDateFormat();			
				
				var result = save("https://api.shanbing.top/comment/v1/save",obj);	
				if(result.errcode == 0){
					obj.commentId = 0;
					var replyString = createReplyComment(obj);
				
					$(".replybox").remove();
					parentEl.find(".reply-list").append(replyString).find(".reply-list-btn:last").click(function(){alert("不能回复自己");});
				}else{
					alert(result.errmsg);
				}
				
			}else{
				alert("不允许回复内容");
			}
		});
	}
	
	/** url 编码解码*/
	function htmlEncodeJQ ( str ) {
		return $('<span/>').text( str ).html();
	}
 
	function htmlDecodeJQ ( str ) {
		return $('<span/>').html( str ).text();
	}

	$.fn.addCommentList=function(options){
		var defaults = {
			data:[],
			add:"",
			url:"https://api.shanbing.top/comment/v1/",
			pageSize: 10,
			pageNum: 1
		}
		var imgURL = "https://www.shanbing.top/assets/images/img.jpg";
		var option = $.extend(defaults, options);
		if(option.add == ""){
			var result = list(option.url+"list",option.pageSize,option.pageNum);

			if(result.errcode == 0){
				for(var i=0;i<result.data.list.length;i++){
					var obj = result.data.list[i];
					
					var replyBody = [];
					for(var j=0;j<obj.replys.length;j++){
						var rePlyBodyObj = {
								id:obj.replys[j].commentId,
								img:imgURL,
								replyName:obj.replys[j].commentName,
								beReplyName:obj.replys[j].replyCommentName,
								time:obj.replys[j].commentDate,
								content:obj.replys[j].commentContent
							}
						replyBody.push(rePlyBodyObj);
					}
					var addObj = {
						id:obj.commentId,
						img:imgURL,
						replyName:obj.commentName,
						time:obj.commentDate,
						content:obj.commentContent,
						replyBody:replyBody					
					};
					option.data.push(addObj);
				}
			}else{
				alert(result.errmsg);
			}
		}
		//加载评论
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
		
		//发表评论
		if(option.add != ""){
			var htmlEncode = htmlEncodeJQ(option.add.content);			
			option.add.content = htmlEncode;
			var result = save(option.url+"save",option.add);
			if(result.errcode == 0){
				obj = option.add;
				var str = crateCommentInfo(obj);
				$(this).prepend(str).find(".reply-btn").click(function(){
					replyClick($(this));
				});
			}else{
				alert(result.errmsg);
			}		
			
		}
	}
	
	
	
})(jQuery);