/*
 * jQuery tag 1.00.1
 *
 *
 *wp
 * 
 *
 *Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.noty.packaged.min.js(used to notify some info)
 */

(function($,undefined){

$.widget('wp.wp_tab',{
	
	version:'1.00.1',
	options:{	
	},
	_create:function(){
		var that=this,   //the that is used for the situation where in other element(not this.element) event function,in these functons the this is refered to other element
			options=this.options;
		// 添加样式和绑定name\id
		this.element.addClass('wp_tabs');
		this.contents=this.element.siblings("div.tabs-content").addClass('wp_tab_content').attr('id',this.element.attr('id')+'_contents');
		// use name of a associated with id of div
		this.contents.children('div').each(function(index){
			$(this).attr('id', 'tab'+index.toString()).addClass('tab-content').data('is_first',1);
		});
		this.element.children('li').children('a').each(function(index){
			$(this).attr('name', 'tab'+index.toString());
		});
		
		// 初始化，第一个tag可见
		that.element.children('li').removeClass('current_tag');
		that.contents.children('.tab-content').hide();
		this.element.find('li:eq(0)').addClass('current_tag');
		this._refreshDiv(this.element.find('li:eq(0)').children('a'));
		// this is used out the plugin
		this.current_content=this.contents.find('#tab0');
	    this.contents.find('#tab0').fadeIn(); 
		
		// binding tag click event
		this._on( this.element, {
		  "click li>a": function(e) {
		    e.preventDefault();
			this._refreshDiv($(e.target));
		  }
		});
		// binding new added tag delete btn event
		this._on( this.element, {
		  "click span.wp_tag_del": function(e) {
		    e.preventDefault();
			// this._refreshDiv($(e.target));
			// 如果有next用next
			if($(e.target).closest('li').next().length!=0)
			{
				this._refreshDiv($(e.target).closest('li').next().children('a'));
			}
			else
			{
				this._refreshDiv($(e.target).closest('li').prev().children('a'));
			}
			$('#' + $(e.target).siblings('a').attr('name')).remove();
			$(e.target).closest('li').remove();
		  }
		});
	},
	refresh:function(){  //refresh and add current flag
		var that=this,
			options=this.options;
		this.contents.children('div').each(function(index){
			$(this).attr('id', 'tab'+index.toString()).addClass('tab-content');
		});
		this.element.children('li').children('a').each(function(index){
			$(this).attr('name', 'tab'+index.toString());
		});
		that.element.children('li').removeClass('current_tag');
		that.contents.children('.tab-content').hide();
		this.element.find('li:eq(0)').addClass('current_tag');
		// used for out change content
		this.current_content=this.contents.find('#tab0');
	    this.contents.find('#tab0').fadeIn(); 
		this._on( this.element, {
		  "click li>a": function(e) {
		    e.preventDefault();
			this._refreshDiv($(e.target));
		  }
		});
	},
	_init:function(){
		
	},
	_refreshDiv:function(targetA){
		// add some related with my app.but not related with the $.hideWpMenu
		if(!!$.hideWpMenu)
		{
			$.hideWpMenu();
		}
		console.log('++++++++++++++++++++in++++refreshDiv');
		
		var that=this,   //the that is used for the situation where in other element(not this.element) event function,in these functons the this is refered to other element
			options=this.options;
		// used for not all reload fresh
		if (targetA.closest("li").is('li.current_tag')&&$('#' + targetA.attr('name')).data('is_first')!='1'){ 
         	return; 
        }
        else{
	
		  console.log('++++++++++++++++++++in++++else');
		  that.contents.children('.tab-content').hide();
          that.element.children('li').removeClass('current_tag');
          targetA.parent('li').addClass('current_tag');
			// this is used for using out the plugin
		 if(targetA.attr('href')!='#' && $('#' + targetA.attr('name')).data('is_first')=='1'){
			var responseText = $.ajax({
				url: targetA.attr('href'),
				type: 'get',
				async: false
				}).responseText;
			$('#' + targetA.attr('name')).html(responseText);
		  }
			that.current_content=$('#' + targetA.attr('name'));
          	$('#' + targetA.attr('name')).fadeIn();
			$('#' + targetA.attr('name')).data('is_first','0');
			// that._shieldFunction();
		}
	},
	add:function(hash){
		// add with fresh
		var that=this;
		if($( "ul.wp_tabs li>a[href='"+hash.href+"']").length==0)
		{	//check has shield?
			if(!!hash.wp_shield){
				if($( "ul.wp_tabs li>a[wp_shield='"+hash.wp_shield+"']").length>0)
				{
					$.notify_modal(
						hash.shield_info+'<br/>'+'<span style="color:red;">点击继续操作，将关闭已打开的相同功能页面。<span>',
						[
						    {addClass: 'btn btn-primary', text: '跳到已打开', onClick: function($noty) {
								$( "ul.wp_tabs li>a[wp_shield='"+hash.wp_shield+"']").trigger('click');
								$noty.close();
						      }
						    },
						    {addClass: 'btn btn-danger', text: '继续操作', onClick: function($noty) {
								$( "ul.wp_tabs li>a[wp_shield='"+hash.wp_shield+"']").parent().find('span.wp_tag_del').trigger('click');
								that.add(hash);
						        $noty.close();
						      }
						    },
						    {addClass: 'btn btn-primary', text: '关闭提示框', onClick: function($noty) {
						        $noty.close();
						      }
						    }
						  ]);
					return;
				}
				else
				{
					// add wp_sheild
					if(this.checkFull())
					{
						$('<li></li>').append($('<a></a>').text(hash.title).attr('href',hash.href).attr('wp_shield', hash.wp_shield)).append($('<span></span>').addClass('wp_tag_del')).appendTo(this.element);
					}
					else
					{
						$.notify('开的标签太多，请先关闭一些！');
						return;
					}
					
				}
			}
			else
			{
				if(this.checkFull())
				{
					$('<li></li>').append($('<a></a>').text(hash.title).attr('href',hash.href)).append($('<span></span>').addClass('wp_tag_del')).appendTo(this.element);
				}
				else
				{
					$.notify('开的标签太多，请先关闭一些！');
					return;
				}
			}
			//only the first reload
			var $newDiv=$('<div></div>').appendTo(this.contents).data('is_first','1');
			// add refreshFunction and delFunction if has
			if(!!hash.refreshFunction)
			{
				this.element.children('li:last').children('a').data('refreshFunction',hash.refreshFunction)
			}
			if(!!hash.delFunction)
			{
				this.element.children('li:last').children('a').data('delFunction',hash.delFunction)
			}
			if(!!hash.backHref)
			{
				this.element.children('li:last').children('a').data('backHref',hash.backHref)
			}	
			this.refresh();
			this._refreshDiv(this.element.children('li:last').children('a'));
		}
		else
		{
			// make dirty
			$('#' + $( "ul.wp_tabs li>a[href='"+hash.href+"']").attr('name')).data('is_first','1');
			// add refreshFunction and delFunction if has
			if(!!hash.refreshFunction)
			{
				$( "ul.wp_tabs li>a[href='"+hash.href+"']").data('refreshFunction',hash.refreshFunction)
			}
			if(!!hash.delFunction)
			{
				$( "ul.wp_tabs li>a[href='"+hash.href+"']").data('delFunction',hash.delFunction)
			}
			if(!!hash.backHref)
			{
				this.element.children('li:last').children('a').data('backHref',hash.backHref)
			}
			this._refreshDiv($( "ul.wp_tabs li>a[href='"+hash.href+"']"));
		}
	},
	change_current_content:function(str_html){
		this.current_content.html(str_html);
	},
	checkFull:function(){
		console.log(this.element.width()/140 );
		console.log($('li',this.element).length);
		return this.element.width()/140 > ($('li',this.element).length+1);
	},
	refreshCurrent:function(){
		// check refresh function
		if(!!this.element.find('li.current_tag>a').data('refreshFunction'))
		{
			this.element.find('li.current_tag>a').data('refreshFunction')();
		}
		// dirty
		this.current_content.data('is_first','1');
		// _freshDiv
		this._refreshDiv(this.element.find('li.current_tag>a'));
	},
	refreshOther:function(href){
		if($("li>a[href='"+href+"']",this.element).length>0) {
			
			var targetA=$("li>a[href='"+href+"']",this.element);
			if(targetA.attr('href')!='#'){
			var responseText = $.ajax({
				url: targetA.attr('href'),
				type: 'get',
				async: false
				}).responseText;
			$('#' + targetA.attr('name')).html(responseText);
		  }
		
		}//end if
	},
	delCurrrent:function(){
		var current_tag=this.element.find('li.current_tag');
		// check del function
		if(!!current_tag.children('a').data('delFunction'))
		{
			current_tag.children('a').data('delFunction')();
		}
		this._refreshDiv(current_tag.prev().children('a'));
		$('#' + current_tag.children('a').attr('name')).remove();
		current_tag.remove();
	},
	delCurrentBack:function(){
		var current_tag=this.element.find('li.current_tag');
		// check del function
		if(!!current_tag.children('a').data('delFunction'))
		{
			current_tag.children('a').data('delFunction')();
		}
		// check if has backHref and if the tag exist.
		if(!!current_tag.children('a').data('backHref')&&$( "li>a[href='"+current_tag.children('a').data('backHref')+"']",this.element).length>0){
			// not make dirty,only swith to the tab
			this._refreshDiv($( "li>a[href='"+current_tag.children('a').data('backHref')+"']",this.element));
		}
		else{
			this._refreshDiv(current_tag.prev().children('a'));
		}
		$('#' + current_tag.children('a').attr('name')).remove();
		current_tag.remove();
	},
	_destroy:function(){
		this.element.removeClass('wp_tabs');
		this.contents.removeClass('wp_tab_content').attr('id','');
		this.contents.children('div').each(function(index,element){
			element.attr('id', '');
		});
		this.element.children('li').children('a').each(function(index, element){
			element.attr('name', '');
		});
	}
});	
})(jQuery);
