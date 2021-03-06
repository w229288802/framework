//DWZ的状态statusCode: {ok:200, error:300, timeout:301}
$.extend(DWZ.statusCode,{
	INVALID_OPERATION:400,
	NO_LOGIN:401,
	NOT_IMPLEMENT:402
});
//处理DWZ的Ajax请求
var handlerAjax=function(jsonResponse){
	//无效操作
	if (jsonResponse[DWZ.keys.statusCode]==DWZ.statusCode.INVALID_OPERATION){
			alertMsg.warn(jsonResponse[DWZ.keys.message]);
			return false;
	}
	//没有登录，或者操作
	else if (jsonResponse[DWZ.keys.statusCode]==DWZ.statusCode.NO_LOGIN){
		window.location=ctx+"/login.jsp";
		return false;
	}
	//DWZ状态为40X的
	else if(parseInt(jsonResponse[DWZ.keys.statusCode]/100)==4){
		alertMsg.warn(jsonResponse[DWZ.keys.message]);
		return false;
	}else if (jsonResponse[DWZ.keys.statusCode]==DWZ.statusCode.error){
		if (jsonResponse[DWZ.keys.message]) alertMsg.error("服务器出错了！请与管理员联系！");
		if($.pdialog.getCurrent()==null||$.trim($.pdialog.getCurrent().css("display"))=="none"){
			navTab.closeCurrentTab();
		}else{
			$.pdialog.closeCurrent();
		}
	} 
					 
	return true;
}
DWZ.getPanel=function(){
	if($.pdialog.getCurrent()==null||$.trim($.pdialog.getCurrent().css("display"))=="none"){
		return navTab.getCurrentPanel();
	}else{
		return $.pdialog.getCurrent();
	}
}
$.fn.ajaxUrl=function(op){
			var $this = $(this);

			$this.trigger(DWZ.eventType.pageClear);
			
			$.ajax({
				type: op.type || 'GET',
				url: op.url,
				data: op.data,
				cache: false,
				success: function(response){ 
					var json = DWZ.jsonEval(response);
					if(handlerAjax&&!handlerAjax(json)){
						return;
					}
					if (json[DWZ.keys.statusCode]==DWZ.statusCode.error){
						//if (json[DWZ.keys.message]) alertMsg.error(json[DWZ.keys.message]);
					} else {
						$this.html(response).initUI();
						if ($.isFunction(op.callback)) op.callback(response);
					}
					
					if (json[DWZ.keys.statusCode]==DWZ.statusCode.timeout){
						if ($.pdialog) $.pdialog.checkTimeout();
						if (navTab) navTab.checkTimeout();
	
						alertMsg.error(json[DWZ.keys.message] || DWZ.msg("sessionTimout"), {okCall:function(){
							DWZ.loadLogin();
						}});
					} 
					
				},
				error: DWZ.ajaxError,
				statusCode: {
					503: function(xhr, ajaxOptions, thrownError) {
						alert(DWZ.msg("statusCode_503") || thrownError);
					}
				}
			});
		},
DWZ.ajaxError=function(xhr, ajaxOptions, thrownError){
	var noCloseCurrentPanel=false;//不关闭当前容器
	if (alertMsg) {
		if(xhr.status==0){
			alertMsg.error("<div>世界上最遥远的距离就是没网</div>");
		}else if(xhr.status==404){
			alertMsg.error("<div>唉哟,没有找到页面!!!</div>");
		}else if(xhr.status==406){
			noCloseCurrentPanel=true;
			alertMsg.error("<div>"+xhr.responseText+"</div>")
		}else if(xhr.status==500){
			alertMsg.error("<div>服务器出错了</div>");
		}else if(xhr.status==501){
			alertMsg.error("<div>服务器出错了</div><hr/><div>出错信息:"+xhr.responseText+"</div>");
		}else if(xhr.status==502){
			window.location=ctx+"/login.jsp";
		}else{
			alertMsg.error("<div>Http状态: " + xhr.status + " " + xhr.statusText + "</div>" 
			+"<hr/>"
			+ "<div>"+xhr.responseText+"</div>");
		}
		if(!noCloseCurrentPanel){
			if($.pdialog.getCurrent()==null||$.trim($.pdialog.getCurrent().css("display"))=="none"){
				navTab.closeCurrentTab();
			}else{
				$.pdialog.closeCurrent();
			}
		}
	} else {
		alert("Http status: " + xhr.status + " " + xhr.statusText + "\najaxOptions: " + ajaxOptions + "\nthrownError:"+thrownError + "\n" +xhr.responseText);
	}
};
$.fn.table=function(op){
	var checkboxKey=checkboxKey?op.id:'id';
	var checkboxField=checkboxField?op.ids:'ids';
	var pid=op&&op.pid;
	var $grid = $(this);
	var html = '<thead><tr>';
	if(checkboxField){   
		html+='<th width="25"><input class="checkboxCtrl"  group="'+checkboxField+'" type="checkbox"></th>';
	}
	$.each(op.columns,function(){
		html+="<th align='center'>"+this.name+"</th>";
	});
	html += '</tr></thead>';
	html +='<tbody>';
	$.each(op.data.rows,function(i){
		var row = this;
		var p= pid?this[pid]:'';
		html+='<tr>';
		if(checkboxField!=undefined){
 			html+='<td><input name="'+checkboxField+'" type="checkbox" value="'+(row[checkboxKey]?row[checkboxKey]:'')+'"></td>';
 		}
		$.each(op.columns,function(){
			var align=this.align?' align="'+this.align+'"':'';
			var title=this.title?' title="'+this.title+'"':'';
			var val;
			if(this.formatter){
				val = this.formatter(row[this.field],i,row);
			}else{
				val = row[this.field];
			}
			html+='<td'+align+title+'>'+(val==null?'':val)+'</td>';
		}); 
		html+='</tr>';
	});
	html +='</tbody>';
	$grid.append(html); 
 		
 };
$.fn.selectBox=function(numPerPage){
	if(numPerPage==undefined){
		alert('selectBox(numPerPage未定义)');
	}
	$(this).find("option:selected").removeAttr("selected");
	$(this).find("option").each(function(){
		if(numPerPage==this.innerHTML){
			$(this).attr("selected","selected");
		}
	});
	$(this).combox();
};
$.fn.bindDialog=function(){
	$(this).each(function(){
		$(this).unbind();
		$(this).click(function(event){
			var $this = $(this);
			var title = $this.attr("title") || $this.text();
			var rel = $this.attr("rel") || "_blank";
			var options = {};
			var w = $this.attr("width");
			var h = $this.attr("height");
			if (w) options.width = w;
			if (h) options.height = h;
			options.max = eval($this.attr("max") || "false");
			options.mask = eval($this.attr("mask") || "false");
			options.maxable = eval($this.attr("maxable") || "true");
			options.minable = eval($this.attr("minable") || "true");
			options.fresh = eval($this.attr("fresh") || "true");
			options.resizable = eval($this.attr("resizable") || "true");
			options.drawable = eval($this.attr("drawable") || "true");
			options.close = eval($this.attr("close") || "");
			options.param = $this.attr("param") || "";

			var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
			DWZ.debug(url);
			if (!url.isFinishedTm()) {
				alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
				return false;
			}
			$.pdialog.open(url, rel, title, options);
			
			return false;
		});
	});
};
$.fn.dwzCheckbox=function(){
	var p = DWZ.getPanel();
	$(this).checkboxCtrl(p);
	var parent =$(this);
	var name = parent.attr("group");
	var checkboxs = parent.parents(".grid").find(":checkbox[name='"+name+"']");
	checkboxs.click(function(){
		var cs = parent.parents(".grid").find(":checkbox[name='"+name+"']");
		var checkedLength = cs.filter("input:checked").length;
		if(checkedLength<cs.length){
			parent.attr("checked",false);
		}else if (checkedLength==cs.length){
			parent.attr("checked",true);
		}
	});
};

