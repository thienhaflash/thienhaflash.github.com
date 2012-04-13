if(typeof wpcom==="undefined"){var wpcom={};}
wpcom.carousel=(function($){var prebuilt_widths=wpcomCarouselStrings.widths;var pageviews_stats_args=wpcomCarouselStrings.stats_query_args;var findFirstLargeEnoughWidth=function(original_w,original_h,dest_w,dest_h){var inverse_ratio=original_h/original_w;for(i=0;i<prebuilt_widths.length;++i){if(prebuilt_widths[i]>=dest_w||prebuilt_widths[i]*inverse_ratio>=dest_h){return prebuilt_widths[i];}}
return original_w;}
var addWidthToImageURL=function(url,width){url=addArgToURL(url,'w',width);url=addArgToURL(url,'h','');return url;}
var addArgToURL=function(url,arg,value){var re=new RegExp(arg+'=[^?&]+');if(url.match(re)){return url.replace(re,arg+'='+value);}else{var divider=url.indexOf('?')!==-1?'&':'?';return url+divider+arg+'='+value;}}
var stat=function(names){var group='carousel';if(typeof names=='string')
names=[names];names_csv=names.join(',')
new Image().src=document.location.protocol+'//stats.wordpress.com/g.gif?v=wpcom-no-pv&x_'+group+'='+names_csv+'&baba='+Math.random();}
var pageview=function(post_id){var x=new Image(1,1);var host=escape(document.location.host);var referrer=escape(document.referrer);x.src=document.location.protocol+'//stats.wordpress.com/g.gif?host='+host+'&ref='+referrer+'&rand='+Math.random()+'&'+pageviews_stats_args+'&post='+post_id;}
return{findFirstLargeEnoughWidth:findFirstLargeEnoughWidth,addWidthToImageURL:addWidthToImageURL,stat:stat,pageview:pageview};})(jQuery);(function($){var overlay,comments,gallery,container,nextButton,previousButton,info,title,resizeTimeout,mouseTimeout,photo_info,close_hint,screenPadding=110;var keyListener=function(e){switch(e.which){case 39:case 75:e.preventDefault();gallery.wpcom_carousel('next');break;case 37:case 74:e.preventDefault();gallery.wpcom_carousel('previous');break;case 27:e.preventDefault();container.wpcom_carousel('close');break;}}
var resizeListener=function(e){clearTimeout(resizeTimeout);resizeTimeout=setTimeout(function(){gallery
.wpcom_carousel('slides')
.wpcom_carousel('fitSlide',true);gallery
.wpcom_carousel('fitInfo',true);},200);}
var prepareGallery=function(){if(!overlay){nextButton=$("<div><span></span></div>")
.addClass('wpcom-carousel-next-button')
.css({position:'absolute',top:'0',right:'0',bottom:'0',width:screenPadding});previousButton=$("<div><span></span></div>")
.addClass('wpcom-carousel-previous-button')
.css({position:'absolute',top:'0',left:'0',bottom:'0',width:screenPadding});overlay=$('<div></div>')
.css({position:'absolute',top:0,right:0,bottom:0,left:0,background:'#000',opacity:0.90});title=$('<h2>Title</h2>');buttons=$('<div class="wpcom-carousel-buttons"><a class="wpcom-carousel-like" href="#">Like</a> <a class="wpcom-carousel-permalink" href="#">Permalink</a></div>');photo_info=$('<div class="wpcom-carousel-photo-info"></div>').append(title).append(buttons);info=$('<div></div>')
.addClass('wpcom-carousel-info')
.css({height:80,left:screenPadding,right:screenPadding})
.append(photo_info);gallery=$('<div></div>')
.addClass('wpcom-carousel')
.css({'position':'absolute','top':0,'bottom':info.height(),'left':0,'right':0});close_hint=$('<div class="wpcom-carousel-close-hint"><span>esc</span></div>');container=$("<div></div>")
.addClass('wpcarousel-wrap')
.css({position:'fixed',top:0,right:0,bottom:0,left:0,zIndex:999999})
.hide()
.append(overlay)
.append(gallery)
.append(info)
.append(nextButton)
.append(previousButton)
.append(close_hint)
.appendTo($('body'))
.click(function(e){var target=$(e.target),wrap=target.parents('div.wpcarousel-wrap'),data=wrap.data('carousel-extra'),slide=wrap.find('div.selected'),attachment_id=slide.data('attachment-id');data=data||[];if(target.is(gallery)||target.parents().add(target).is(close_hint)){container.wpcom_carousel('close');}else if(target.hasClass('wpcom-carousel-like')){var new_text=wpcomCarouselStrings.unlike,action='like',attr=1;if(target.hasClass('liked')){new_text=wpcomCarouselStrings.like;action='unlike';attr=0;}
e.preventDefault();e.stopPropagation();wpcom.carousel.stat('like');target.fadeOut(100,function(){target.toggleClass('liked',attr).text(new_text).fadeIn(100);slide.data('liked',attr);$('div.gallery').find('img[data-attachment-id="'+slide.data('attachment-id')+'"]').data('liked',attr);});$.post('/wp-admin/admin-ajax.php',{'action':action+'_it','_wpnonce':data[2],'blog_id':data[0],'post_id':attachment_id});}else if(target.hasClass('wpcom-carousel-reblog')){e.preventDefault();e.stopPropagation();target.wpcom_carousel('show_reblog_box');wpcom.carousel.stat('reblog_show_box');}else if(target.hasClass('wpcom-carousel-permalink')){e.stopPropagation();}else if(target.is('a.cancel')&&tagret.parents('#reblog-box').length){return;e.preventDefault();e.stopPropagation();$('div.wpcom-carousel-info').children().not('#reblog-box').fadeIn('fast');$('#reblog-box').fadeOut('fast');wpcom.carousel.stat('reblog_cancel');}else if(target.is('input[type="submit"]')&&tagret.parents('#reblog-box').length){return;var t=$(this),data=$('div.gallery').data('carousel-extra').split(',');e.preventDefault();e.stopPropagation();t.attr('value','Reblogging...');t.prop('disabled',true);$('#reblog-box div.submit span.canceltext').fadeOut(150,function(){t.after('<span class="loading"></span>');});$.post('/wp-admin/admin-ajax.php',{'action':'carousel_reblog','ids':data[0]+','+$('.wpcom-carousel div.selected').data('attachment-id'),'blog_id':$('#reblog-box select').val(),'blog_url':$('#reblog-box input#blog-url').val(),'blog_title':$('#reblog-box input#blog-title').val(),'post_url':$('#reblog-box input#post-url').val(),'post_title':$('#reblog-box input#post-title').val(),'note':$('#reblog-box textarea').val(),'_wpnonce':$('#reblog-box #_wpnonce').val()},function(result){$('#reblog-box').css({height:$('#reblog-box').height()+'px'}).slideUp('fast');$('a.wpcom-carousel-reblog').html('<span></span>Reblogged').removeClass('reblog').addClass('reblogged');$('#reblog-box span.loading').remove();t.attr('value','Post Reblog');$('div.wpcom-carousel-info').children().not('#reblog-box').fadeIn('fast');},'json');wpcom.carousel.stat('reblog_submit');}else{container.wpcom_carousel('next');}})
.bind('wpcom_carousel.afterOpen',function(){$(window).bind('keydown',keyListener);$(window).bind('resize',resizeListener);})
.bind('wpcom_carousel.beforeClose',function(){var scroll=$(window).scrollTop();$(window).unbind('keydown',keyListener);$(window).unbind('resize',resizeListener);document.location.hash='';$(window).scrollTop(scroll);});nextButton.add(previousButton).click(function(e){e.preventDefault();e.stopPropagation();if(nextButton.is(this)){gallery.wpcom_carousel('next');}else{gallery.wpcom_carousel('previous');}});};}
var methods={open:function(options){var settings={'items_selector':".gallery-item [data-attachment-id]",'start_index':0},data=$(this).data('carousel-extra');if(!data)
return;prepareGallery();container.data('carousel-extra',data);wpcom.carousel.stat('open');if(!wpcomCarouselStrings.is_logged_in){$('.wpcom-carousel-like').hide();}
return this.each(function(){var $this=$(this);if(options)
$.extend(settings,options);if(-1==settings.start_index)
settings.start_index=0;container.trigger('wpcom_carousel.beforeOpen').fadeIn('fast',function(){container.trigger('wpcom_carousel.afterOpen');gallery
.wpcom_carousel('initSlides',$this.find(settings.items_selector),settings.start_index)
.wpcom_carousel('start',settings.start_index);});gallery.html('');});},start:function(start_index){var slides=this.wpcom_carousel('slides'),selected=slides.eq(start_index);if(selected.length==0)
selected=slides.eq(0)
gallery.wpcom_carousel('selectSlide',selected,false);return this;},close:function(){return container
.trigger('wpcom_carousel.beforeClose')
.fadeOut('fast',function(){container.trigger('wpcom_carousel.afterClose');});},next:function(){var selected=this.wpcom_carousel('selectedSlide'),slide;if(selected.length==0){slide=this.wpcom_carousel('slides').first(0);}else if(selected.is(this.wpcom_carousel('slides').last())){gallery.wpcom_carousel('loopSlides');}else{slide=selected.next();}
if(!slide){return this;}else{wpcom.carousel.stat('next');return this.wpcom_carousel('selectSlide',slide);}},previous:function(){var selected=this.wpcom_carousel('selectedSlide'),slide;if(selected.length==0){slide=this.wpcom_carousel('slides').first();}else if(selected.is(this.wpcom_carousel('slides').first())){gallery.wpcom_carousel('loopSlides',true);}else{slide=selected.prev();}
if(!slide){return this;}else{wpcom.carousel.stat('previous');return this.wpcom_carousel('selectSlide',slide);}},resetButtons:function(current){if(current.data('liked'))
$('.wpcom-carousel-buttons a.wpcom-carousel-like').addClass('liked').text(wpcomCarouselStrings.unlike);else
$('.wpcom-carousel-buttons a.wpcom-carousel-like').removeClass('liked').text(wpcomCarouselStrings.like);$('.wpcom-carousel-buttons a.wpcom-carousel-permalink').attr('href',current.data('permalink'));},loopSlides:function(reverse){var slides=gallery.wpcom_carousel('slides'),last,first;gallery.wpcom_carousel('selectedSlide').removeClass('selected');if(reverse!==true){last=slides.last();slides.first().nextAll().not(last).css({left:gallery.width()+slides.first().width()}).hide();last.css({left:-last.width()});last.prev().css({left:-last.width()-last.prev().width()});slides.first().css({left:gallery.width()});setTimeout(function(){gallery.wpcom_carousel('selectSlide',slides.show().first());},400);}else{first=slides.first();first.css({left:gallery.width()});first.next().css({left:gallery.width()+first.width()});first.next().nextAll().hide().css({left:-slides.last().width()});slides.last().css({left:-slides.last().width()});slides.last().prevAll().not(first,first.next()).hide().css({left:-slides.last().width()-slides.last().prev().width()});setTimeout(function(){gallery.wpcom_carousel('selectSlide',slides.show().last());},400);}},selectedSlide:function(){return this.find('.selected');},selectSlide:function(slide,animate){var last=this.find('.selected').removeClass('selected'),slides=gallery.wpcom_carousel('slides'),current=$(slide).addClass('selected'),previous=current.prev(),next=current.next(),width=$(window).width(),previous_previous=previous.prev(),next_next=next.next(),left=(gallery.width()-current.width())*0.5,info_left,animated,info_min;method='css';animated=current
.add(previous)
.add(previous.prev())
.add(next)
.add(next.next())
.wpcom_carousel('loadSlide');slides.not(animated).hide();current[method]({left:left}).show();gallery.wpcom_carousel('fitInfo',animate);var direction=last.is(current.prevAll())?1:-1;if(1==direction){next_next.css({left:gallery.width()+next.width()}).show();next.hide().css({left:gallery.width()+current.width()}).show();previous_previous.css({left:-previous_previous.width()-current.width()});}else{previous.css({left:-previous.width()-current.width()});next_next.css({left:gallery.width()+current.width()});}
previous[method]({left:-previous.width()+(screenPadding*0.75)}).show();next[method]({left:gallery.width()-(screenPadding*0.75)}).show();title.html(current.data('title')||'');document.location.href=document.location.href.replace(/#.*/,'')+'#wpcom-carousel-'+current.data('attachment-id');this.wpcom_carousel('resetButtons',current);container.trigger('wpcom_carousel.selectSlide',[current]);wpcom.carousel.pageview(current.data('attachment-id'));},slides:function(){return this.find('.wpcom-carousel-slide');},slideDimensions:function(){return{width:$(window).width()-(screenPadding*2),height:$(window).height()-info.height()*2}},loadSlide:function(){return this.each(function(){var slide=$(this),max=gallery.wpcom_carousel('slideDimensions'),orig=slide.wpcom_carousel('originalDimensions');slide.find('img')
.one('load',function(){slide
.wpcom_carousel('fitSlide',false);slide.find('img').fadeIn();})
.attr('src',wpcom.carousel.addWidthToImageURL(slide.data('src'),wpcom.carousel.findFirstLargeEnoughWidth(orig.width,orig.height,max.width,max.height)));});},bestFit:function(){var max=gallery.wpcom_carousel('slideDimensions'),orig=this.wpcom_carousel('originalDimensions');if(orig.width>max.width||orig.height>max.height){ratio=Math.min(Math.min(max.width/orig.width,1),Math.min(max.height/orig.height,1));}else{ratio=1;}
return{width:orig.width*ratio,height:orig.height*ratio};},fitInfo:function(animated){var current=this.wpcom_carousel('selectedSlide'),size=current.wpcom_carousel('bestFit');photo_info.css({left:(info.width()-size.width)*0.5,width:size.width});return this;},fitSlide:function(animated){return this.each(function(){var selected=gallery.wpcom_carousel('selectedSlide'),$this=$(this),dimensions=$this.wpcom_carousel('bestFit'),method='css',max=gallery.wpcom_carousel('slideDimensions');if(selected.length==0){dimensions.left=$(window).width();}else if($this.is(selected)){dimensions.left=($(window).width()-dimensions.width)*0.5;}else if($this.is(selected.next())){dimensions.left=gallery.width()-(screenPadding*0.75);}else if($this.is(selected.prev())){dimensions.left=-dimensions.width+screenPadding*0.75;}else{if($this.is(selected.nextAll())){dimensions.left=$(window).width();}else{dimensions.left=-dimensions.width;}}
dimensions.bottom=(max.height-dimensions.height)*0.5;$this[method](dimensions);})},initSlides:function(items,start_index){var width=this.wpcom_carousel('slideDimensions').width,x=0;items.each(function(i){var src_item=$(this),liked=src_item.data('liked')||0,attachment_id=src_item.data('attachment-id')||0,orig_size=src_item.data('orig-size')||0;if(!attachment_id||!orig_size)
return false;$('<div class="wpcom-carousel-slide"></div>')
.hide()
.css({left:i<start_index?-1000:gallery.width()})
.append($('<img>'))
.appendTo(gallery)
.data('src',src_item.attr('src'))
.data('title',src_item.parents('dl').find('dd.gallery-caption').html())
.data('attachment-id',attachment_id)
.data('permalink',src_item.parents('a').attr('href'))
.data('orig-size',orig_size)
.data('liked',liked)
.wpcom_carousel('fitSlide',false)
.find('img').hide();});return this;},show_reblog_box:function(){return;var t=$(this),data=$('div.gallery').data('carousel-extra');data=data?data.split(','):[];$('#reblog-box textarea').val('Your comments (optional)');t.addClass('selected');$('#reblog-box p.response').remove();$('#reblog-box div.submit, #reblog-box div.submit span.canceltext').show();$('#reblog-box div.submit input[type=submit]').prop('disabled',false);$('#reblog-box input#post-url').val(t.parents('div.wpcarousel-wrap').find('div.selected').attr('data-permalink'));$('#reblog-box input#post-title').val(t.parents('div.wpcom-carousel-info').children('h2').text());$('div.wpcom-carousel-info').append($('#reblog-box')).children().fadeOut('fast');$('#reblog-box').fadeIn('fast');},originalDimensions:function(){var splitted=$(this).data('orig-size').split(',');return{width:parseInt(splitted[0],10),height:parseInt(splitted[1],10)};}};$.fn.wpcom_carousel=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else if(typeof method==='object'||!method){return methods.open.apply(this,arguments);}else{$.error('Method '+method+' does not exist on jQuery.wpcom_carousel');}}
$(document.body).on('click','div.gallery',function(e){e.preventDefault();$(this).wpcom_carousel('open',{start_index:$(this).find('.gallery-item').index($(e.target).parents('.gallery-item'))});});if(document.location.hash&&document.location.hash.match(/wpcom-carousel-(\d+)/)){$(document).ready(function(){var gallery=$('div.gallery'),index=-1,n=document.location.hash.match(/wpcom-carousel-(\d+)/);n=parseInt(n[1],10);gallery.find('img').each(function(num,el){if(n&&$(el).data('attachment-id')==n){index=num;return false;}});if(index!=-1)
gallery.wpcom_carousel('open',{start_index:index});});}})(jQuery);