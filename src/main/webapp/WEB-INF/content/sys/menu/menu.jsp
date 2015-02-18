<%@ include  file="/common/taglib.jsp"%>
<style type="text/css">
	ul.rightTools {float:right; display:block;}
	ul.rightTools li{float:left; display:block; margin-left:5px}
</style>
<style>
<!--
-->
</style>
<link rel="stylesheet" href="${base}/resources/widget/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
<script type="text/javascript" src="${base}/resources/widget/ztree/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="${base}/resources/widget/ztree/js/jquery.ztree.excheck-3.5.js"></script>
<script type="text/javascript" src="${base}/resources/widget/ztree/js/jquery.ztree.exedit-3.5.js"></script>
<script type="text/javascript" src="${base}/resources/app/menu/ztree.js"></script>
<script type="text/javascript">
var setting = {
		view: {
			selectedMulti: false
		},
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		data: {
			keep: {
				parent:true,
				leaf:true
			},
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeDrag: beforeDrag,
			beforeRemove: beforeRemove,
			beforeRename: beforeRename,
			onRemove: onRemove,
			onClick:onClick
		}
	};

	var zNodes =[
		{ id:1, pId:0, name:"父节点 1", open:true},
		{ id:11, pId:1, name:"叶子节点 1-1"},
		{ id:12, pId:1, name:"叶子节点 1-2"},
		{ id:13, pId:1, name:"叶子节点 1-3"},
		{ id:2, pId:0, name:"父节点 2", open:true},
		{ id:21, pId:2, name:"叶子节点 2-1"},
		{ id:22, pId:2, name:"叶子节点 2-2"},
		{ id:23, pId:2, name:"叶子节点 2-3"},
		{ id:3, pId:0, name:"父节点 3", open:true},
		{ id:31, pId:3, name:"叶子节点 3-1"},
		{ id:32, pId:3, name:"叶子节点 3-2"},
		{ id:33, pId:3, name:"叶子节点 3-3"}
	];
	function onClick(){
	}
	var log, className = "dark";
	function beforeDrag(treeId, treeNodes) {
		return false;
	}
	function beforeRemove(treeId, treeNode) {
		className = (className === "dark" ? "":"dark");
		showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
		return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
	}
	function onRemove(e, treeId, treeNode) {
		showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
	}
	function beforeRename(treeId, treeNode, newName) {
		if (newName.length == 0) {
			alert("节点名称不能为空.");
			var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
			setTimeout(function(){zTree.editName(treeNode)}, 10);
			return false;
		}
		return true;
	}
	function showLog(str) {
		if (!log) log = $("#log");
		log.append("<li class='"+className+"'>"+str+"</li>");
		if(log.children("li").length > 8) {
			log.get(0).removeChild(log.children("li")[0]);
		}
	}
	function getTime() {
		var now= new Date(),
		h=now.getHours(),
		m=now.getMinutes(),
		s=now.getSeconds(),
		ms=now.getMilliseconds();
		return (h+":"+m+":"+s+ " " +ms);
	}

	var newCount = 1;
	function add(e) {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo2"),
		isParent = e.data.isParent,
		nodes = zTree.getSelectedNodes(),
		treeNode = nodes[0];
		if (treeNode) {
			treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"new node" + (newCount++)});
		} else {
			treeNode = zTree.addNodes(null, {id:(100 + newCount), pId:0, isParent:isParent, name:"new node" + (newCount++)});
		}
		if (treeNode) {
			zTree.editName(treeNode[0]);
		} else {
			alert("叶子节点被锁定，无法增加子节点");
		}
	};
	function edit() {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo2"),
		nodes = zTree.getSelectedNodes(),
		treeNode = nodes[0];
		if (nodes.length == 0) {
			alert("请先选择一个节点");
			return;
		}
		zTree.editName(treeNode);
	};
	function remove(e) {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo2"),
		nodes = zTree.getSelectedNodes(),
		treeNode = nodes[0];
		if (nodes.length == 0) {
			alert("请先选择一个节点");
			return;
		}
		var callbackFlag = $("#callbackTrigger").attr("checked");
		zTree.removeNode(treeNode, callbackFlag);
	};
	function clearChildren(e) {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo2"),
		nodes = zTree.getSelectedNodes(),
		treeNode = nodes[0];
		if (nodes.length == 0 || !nodes[0].isParent) {
			alert("请先选择一个父节点");
			return;
		}
		zTree.removeChildNodes(treeNode);
	};
	
	$(document).ready(function(){
		$.fn.zTree.init($("#treeDemo2"), setting, zNodes);
		$("#addParentNode").bind("click", {isParent:true}, add);
		$("#addLeaf").bind("click", {isParent:false}, add);
		$("#edit").bind("click", edit);
		$("#remove").bind("click", remove);
		$("#clearChildren").bind("click", clearChildren);
	});
</script>
<div class="pageContent" >
				

	<div class="panel" defH="40" >
			<h1>病人基本信息</h1>
			<div>
				病人编号：<input type="text" name="patientNo" />
				<ul class="rightTools">
					<li><a id="addParentNode" class="button" href="#"><span>添加文件夹</span></a></li>
				</ul>
			</div>
	</div>
	<div class="panel" defH="395">
		<h1>自定义菜单功能</h1>
		<div  style="float:left;  overflow:auto; width:240px; border:solid 1px #CCC; line-height:21px; background:#fff">
			<div class="pageContent">
				<ul  id="treeDemo2" class="ztree"></ul>
			</div>
		</div>
		<div id="jbsxBox" class="unitBox" style="margin-left:246px;">
		
		</div> 
	</div>
</div>
	


	

