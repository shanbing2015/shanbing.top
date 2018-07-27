$(function(){				
	$(".comment-list").addCommentList();
    $("#comment").click(function(){
		var obj = new Object();
        obj.img="http://www.shanbing.top/assets/images/img.jpg";
        obj.replyName="神秘人物";
        obj.content=$("#content").val();
        //obj.browse="深圳";
        //obj.osname="win10";
        //obj.replyBody="";	              		
		$(".comment-list").addCommentList({data:[],add:obj});
		$("#content").val("");
    });
})

