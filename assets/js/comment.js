$(function(){				
	setTimeout($(".comment-list").addCommentList(),2000);
    $("#comment").click(function(){
		var obj = new Object();
        obj.img="http://www.shanbing.top/assets/images/img.jpg";
        obj.replyName="匿名";
        obj.content=$("#content").val();
        obj.replyBody="";		
		$(".comment-list").addCommentList({data:[],add:obj});
		$("#content").val("");
    });
})

