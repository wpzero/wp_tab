# wp_tab
this is a jquery ui plugin, used for tab, but it is very awesome, it suppot ajax to load the page, add a tab , close a tab, controll the tab, this is very similar to 163 email the ui interactive. trust me this tab is used to build a project architecture.
and I write some this plugin ruby helper. If you want to use and see, contact me.

## Installation
Depends:  jquery.ui.core.js, jquery.ui.widget.js, jquery.noty.packaged.min.js(used to notify some info)

## Usage
such as:
```
<ul id='bill_management'>
    <li><a href="#">服务单管理</a></li>
</ul>
<div class='tabs-content'> 
    <div>
		<div class="wp_content_nav">
			<ul>
		    	<li>
		        	<a href="/work_spaces/list_items" class='pop_tab' data-title='工位管理'>
		            	<div class="wp_content_nav_title">
		                    <img src="images/nav_icon.png" />工位管理
		                </div>
		                <p class="wp_content_nav_title_summary">工位管理。</p>
		            </a>
		        </li>
		        <li>
		        	<a href="/car_bills" class='pop_tab' data-title='服务单'>
		            	<div class="wp_content_nav_title2">
		                    <img src="images/nav_icon.png" />服务单
		                </div>
		                <p class="wp_content_nav_title_summary2">服务单。。。。</p>
		            </a>
		        </li>
				<li>
		        	<a href="/pages/undone_work" class='pop_tab' data-title='待处理任务'>
		            	<div class="wp_content_nav_title3">
		                    <img src="images/nav_icon.png" />待处理任务
		                </div>
		                <p class="wp_content_nav_title_summary3">待处理任务...</p>
		            </a>
		        </li>
		    </ul>	
		</div>
	</div>
</div>

<script>
$(function(){
	// initial tabs
	$(function(){
		wp_tabs=$('#bill_management').wp_tab({});
	});
});
</script>
```
init the tab.

```
<table cellpadding="0" cellspacing="0" border="0" class="x-data-list" id="doing-bills-table">
<thead>
  <tr>
    <th>车牌号</th>
	<th>车型</th>
	<th>服务进度</th>
	<th>进行时间</th>
	<th></th>
  </tr>
</thead>
<tbody>
<%@car_bills.each do |car_bill|%>
<tr>
  <td><%= car_bill.car_file.car_num %></td>
  <td><%= car_bill.get_car_category%></td>
  <td><%= car_bill.get_service_process%></td>
  <td><%= car_bill.get_prc_time%></td>
  <td><a class='proc' data-id='<%= car_bill.id%>'>操作</a></td>
</tr>
<%end%>
</tbody>
</table>


<script>
$(function(){
	var args = $.extend(true, {}, Contants.table, {
	});
	
	$('#doing-bills-table').dataTable(args);
});

$(function(){
	$('a.proc').wp_menu({
	scrollSelector:'div.inner-tab-content-1',
	bindings:{
		'查看':function(id){
			wp_tabs.wp_tab('add',{title:'服务单', href:'/car_bills/'+id });
		},
		'编辑':function(id){
			wp_tabs.wp_tab('add',{
			title:'编辑服务单', 
			href:'/car_bills/'+id+'/edit',
			refreshFunction:function(){
				wp_tabs.wp_tab('refreshOther','/car_bills');
			},
			delFunction:function(){
				wp_tabs.wp_tab('refreshOther','/car_bills');
			},
			wp_shield:'car_bill',
			shield_info:'与服务单相关的操作窗口已打开，如（新建或编辑），请先关闭再进行此操作！' 
			});
		},
		'结算':function(id){
		  	var r=confirm('确定结算？');
			if (r==true)
			{
				ajaxProcessPurl('car_bills/'+id+'/settle_control',{},function(){
					wp_tabs.wp_tag('refreshOther','/car_bills');
				});
		  	}
			else
			{

			}
		},
		'客户信息':function(id){
			wp_tabs.wp_tab('add',{title:'客户信息', href:'/customers/edit_from_bill?bill_id='+id });
		},
		'汽车档案':function(id){
			wp_tabs.wp_tab('add',{title:'汽车档案', href:'/car_files/edit_from_bill?bill_id='+id, wp_shield:'car_file', shield_info:'与汽车档案相关的操作的窗口已打开，如（新建或编辑），请先关闭再进行此操作！' });
		},
		'填写派工':function(id){
			wp_tabs.wp_tab('add',{title:'汽车档案', href:'/car_bills/'+id+'/fill_work', wp_shield:'fill_work', shield_info:'与汽车档案相关的操作的窗口已打开，如（新建或编辑），请先关闭再进行此操作！' });
		}
	},
	onShowfn:function(event,data){
		
	}
	});
});
</script>
```
this example use wp_menu to present a list items menu. and use the wp_ajax to present the main content.
this example include add manipulation, refreshOther manipulation and so on.

## API

* ``wp_tabs.wp_tab('add',{title:'客户信息', href:'/customers/edit_from_bill?bill_id='+id });`` the add tab api
* ``wp_tabs.wp_tab('refreshCurrent')`` refresh current actived tab
* ``wp_tabs.wp_tab('refreshOther', href)``  refresh the herf identified tab
* ``wp_tabs.wp_tab('delCurrrent')`` remove the current actived tab
* ``wp_tabs.wp_tab('delCurrentBack')`` remove the current actived tab and the current actived element has data-backHref, so jump to the backHref indentified tab




