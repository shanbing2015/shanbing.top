//初始化数据
        var arr = [
                {id:1,img:"/assets/images/img.jpg",replyName:"admin",beReplyName:"匿名",content:"test。",time:"2018-06-26 00:00:00",address:"深圳",osname:"",browse:"谷歌",replyBody:[]}
        ];


        $(function(){
                $(".comment-list").addCommentList({data:arr,add:""});
                $("#comment").click(function(){
                        var obj = new Object();
                        obj.img="/assets/images/img.jpg";
                        obj.replyName="神秘人物";
                        obj.content=$("#content").val();
                        obj.browse="深圳";
                        obj.osname="win10";
                        obj.replyBody="";
                
                var data = {
                        "a":"b"
						};
                var url = "https://test";				
				
				$(".comment-list").addCommentList({data:[],add:obj});                        
                });
				
        })

