var wpNotesAdminBar;var wpNotesCommentReply;(function($){wpNotesAdminBar={activeNoteId:false,activeNote:false,showingPanel:false,bodiesLoaded:false,init:function(){var t=this;if($('#notes-unread-count').hasClass('unread')){t.bumpStat('notes-menu-impressions','non-zero');}
else if($('#notes-unread-count').hasClass('read')){t.bumpStat('notes-menu-impressions','zero');}
this.handle=$('#wp-admin-bar-notes');this.isRtl=$('#wpadminbar').hasClass('rtl');this.panel=$('#notes-panel',this.handle);this.list=$('#notes-list',this.handle);this.notes=$('#notes-notes',this.handle);this.handle.unbind('mouseenter mouseleave');this.handle.children('.ab-item').click(function(e){$('#wp-admin-bar-notes').toggleClass('stayopen');e.preventDefault();t.togglePanel();if(!t.bodiesLoaded){t.loadNoteBodies();t.bodiesLoaded=true;}
if($('#notes-unread-count').hasClass('unread')){t.bumpStat('notes-menu-clicks','non-zero');}
else{t.bumpStat('notes-menu-clicks','zero');}
if(t.showingPanel)
t.markAllNotesRead();return false;});$('*').live("mousedown focus",function(e){if(!this||e.target!=this)
return true;if($(this).parents('#wp-admin-bar-notes').length)
return true;$('#wp-admin-bar-notes').removeClass('stayopen');t.hidePanel();});$('#notes-list .note-summary').click(function(e){e.preventDefault();t.clickNoteSummary($(this).parent().attr('data-id'));return false;});t.addTriangle();$('#notes-list .note').bind({mouseenter:function(){var icon=$('span.icon img',this)[0];icon.zoomed=false;if(icon.naturalHeight<=icon.height&&icon.naturalWidth<=icon.width)
return;if(typeof icon._width=="undefined"){icon._width=icon.width;icon._height=icon.height;}
$(icon)
.stop()
.animate({width:icon.naturalWidth,height:icon.naturalHeight},166,function(e){});icon.zoomed=true;},mouseleave:function(){var icon=$('span.icon img',this)[0];if(!icon.zoomed)
return;$(icon).stop()
.animate({width:icon._width,height:icon._height},166);icon.zoomed=false;}});$('span.icon.mult').prepend('<span class="stack1"></span><span class="stack2"></span>');this.resetPanel();},note:function(noteId){return $('#note-'+noteId);},noteSummary:function(noteId){return $('#note-'+noteId+' .note-summary');},noteBody:function(noteId){return $('#note-'+noteId+' .note-body');},addTriangle:function(){var triDir=wpNotesAdminBar.isRtl?'l':'r';$('<img class="tri" src="/i/triangle-10x20-'+triDir+'.png"/>')
.appendTo('#notes-list .note-body');},loadNoteBodies:function(){var note_ids=new Array();$('.note-body').each(function(){note_ids.push($(this).parent().attr('data-id'));});$.post('/wp-admin/admin-ajax.php',{action:'notes_get_bodies',_wpnonce:this.list.attr('data-bodies-nonce'),ids:note_ids.join(',')},function(res){try{var note_bodies=$.parseJSON(res);for(note_id in note_bodies){var note_body=$('#note-'+note_id+' .note-body');note_body.html(note_bodies[note_id]).removeClass('note-body-empty');}
$('.note-body').spin(false);$('#notes-list .note-mute-icon').click(function(e){e.preventDefault();wpNotesAdminBar.toggleNoteMute($(this));return false;});wpFollowButton.enable();wpNotesAdminBar.addTriangle();Gravatar.attach_profiles('.note-body');wpNotesAdminBar.addCommentHandles();$('a[notes-data-click]').mousedown(function(e){var type=$(this).attr('notes-data-click');wpNotesAdminBar.bumpStat('notes-click-body',type);return true;});$('a[notes-data-action]').mousedown(function(e){var type=$(this).attr('notes-data-action');wpNotesAdminBar.bumpStat('notes-click-action',type);return true;});}catch(e){console.error(e);}});return false;},hidePanel:function(){if(this.showingPanel){this.togglePanel();$('#notes-list div.note.unread').addClass('read').removeClass('unread');}},showPanel:function(){if(!this.showingPanel)
this.togglePanel();},togglePanel:function(){this.resetPanel();this.handle.toggleClass('show');this.showingPanel=this.handle.hasClass('show');this.resetPanel();},resetPanel:function(){var t=this;if(this.activeNote)
this.hideNoteBody(this.activeNoteId,0);this.panel.css({height:this.list.height()});},clickNoteSummary:function(noteId){if(this.activeNoteId==noteId)
this.hideNoteBody(166);else
this.showNoteBody(noteId);},hideNoteBody:function(ms){if(typeof ms=="undefined")
ms=166;this.setActiveNote(false);$(".note-body",this.list)
.css({display:"none"});},showNoteBody:function(noteId,ms){var mintop=$(".note",this.list).first().position().top-1;var last=$(".note",this.list).last();if(typeof ms=="undefined")
ms=166;this.hideNoteBody(112);this.markNoteRead(noteId);this.setActiveNote(noteId);var body=this.noteBody(noteId),b=body[0];var offsetDirection=this.isRtl?'right':'left';var cssArgs={};if(typeof b._top=="undefined"){cssArgs['z-index']=-99999;cssArgs['display']='block';cssArgs[offsetDirection]=0;body.css(cssArgs);b._top=this.activeNoteSummary.position().top
-body.outerHeight()/2
+this.activeNoteSummary.outerHeight()/2;var clearance=last.position().top+last.outerHeight()
-b._top-body.outerHeight();if(clearance<0)
b._top+=clearance;if(b._top<mintop)
b._top=mintop;}
$('img.tri',body)
.css({top:this.activeNoteSummary.position().top
-b._top+26});cssArgs['z-index']='auto';cssArgs['display']='block';cssArgs[offsetDirection]=-body.outerWidth()-6;cssArgs['top']=b._top;body.css(cssArgs);if(false!==this.activeNote){this.bumpStat('notes-click-type',this.activeNote.attr('data-type'));}
if($(body).hasClass('note-body-empty')){$(body).spin('large');}},setActiveNote:function(noteId){this.activeNoteId=noteId;$('.note',this.list).removeClass('active');if(noteId==false){this.activeNote=false;this.activeNoteSummary=false;}else{this.activeNote=this.note(noteId);this.activeNote.addClass('active');this.activeNoteSummary=this.noteSummary(noteId);}},markNoteRead:function(noteId){var n=this.note(noteId);if(n.hasClass('read'))
return;n.removeClass('unread').addClass('read');},markAllNotesRead:function(){var note_imps='';$('#notes-list .note').each(function(){var n=$(this);var noteId=n.attr('data-id');note_imps+=n.attr('data-type')+',';if(n.hasClass('unread')){$.post('/wp-admin/admin-ajax.php',{action:'notes_mark_as_read',_wpnonce:n.attr('data-nonce'),read:n.attr('data-unread'),id:noteId},function(res){});}});var count=$('#notes-unread-count')
count.html(0);count.removeClass('unread').addClass('read');if(0<note_imps.length)
note_imps=note_imps.substring(0,note_imps.length-1)
this.bumpStat('notes-imps-type',note_imps);},toggleNoteMute:function(link){var new_mute='';if(link.hasClass('muted')){link.removeClass('muted').addClass('unmuted');link.attr('title','Mute this post (this is an Automattic only feature)');link.text('Mute this post (A8C)');new_mute='0';}
else{link.removeClass('unmuted').addClass('muted');link.attr('title','Unmute this post (this is an Automattic only feature)');link.text('Unmute this post (A8C)');new_mute='1';}
$.post('/wp-admin/admin-ajax.php',{action:'notes_mark_as_mute',_wpnonce:link.attr('data-nonce'),mute:new_mute,type:link.attr('data-type'),id:link.attr('data-id')},function(res){});},bumpStat:function(group,names){new Image().src=document.location.protocol+'//stats.wordpress.com/g.gif?v=wpcom-no-pv&x_'+
group+'='+names+'&baba='+Math.random();},addCommentHandles:function(){this.list.find('.gen_commented_note .wn-approve a, .gen_commented_note .wn-unapprove a, .gen_commented_note .wn-spam a, .gen_commented_note .wn-unspam a, .gen_commented_note .wn-untrash a, .gen_commented_note .wn-trash a, .gen_reblogged_note .wn-approve a, .gen_reblogged_note .wn-unapprove a, .gen_reblogged_note .wn-spam a, .gen_reblogged_note .wn-unspam a, .gen_reblogged_note .wn-untrash a, .gen_reblogged_note .wn-trash a').click(function(e){e.preventDefault()
var link=$(this);var span=link.parent();var link_type=span.attr('class');if(0===link_type.indexOf('wn-un'))
link_type='wn-'+link_type.substr(5);else
link_type='wn-un'+link_type.substr(3);span.parent().children('.'+link_type).removeClass('hide');span.addClass('hide');if(('spam'==link.attr('data-arg'))||('trash'==link.attr('data-arg')))
span.parent().parent().children('.comment-block').css({background:'#F3F3F3'});else if(('unspam'==link.attr('data-arg'))||('untrash'==link.attr('data-arg')))
span.parent().parent().children('.comment-block').css({background:'none'});var data={'id':link.attr('data-c'),'action':link.attr('data-action'),'blog_id':link.attr('data-blog-id'),'_blog_nonce':link.attr('data-nonce'),'_wpnonce':link.attr('data-wpnonce')};data[link.attr('data-arg')]=1;$.post(link.attr('href'),data,function(res){if('object'==typeof res.errors){span.parent().children('.'+link_type).addClass('hide');span.removeClass('hide');}});});wpNotesCommentReply.init();this.list.find('a.comment-reply-toggle').click(function(e){e.preventDefault()
wpNotesCommentReply.open($(this).attr('data-blog-id'),$(this).attr('data-comment-id'),$(this).attr('data-note-id'));});this.list.find('a.reblog-reply-toggle').click(function(e){e.preventDefault()
wpNotesCommentReply.open($(this).attr('data-blog-id'),$(this).attr('data-post-id'),$(this).attr('data-note-id'));});}};wpNotesCommentReply={div_reply:'',div_actions:'',init:function(){$('#notes-list .gen_commented_note .button-secondary, #notes-list .gen_reblogged_note .button-secondary').click(function(e){e.preventDefault();wpNotesCommentReply.close();});$('#notes-list .gen_commented_note .button-primary, #notes-list .gen_reblogged_note .button-primary').click(function(e){e.preventDefault();wpNotesCommentReply.send($(this));});},close:function(){var t=this;if(''!=t.div_reply){$(t.div_reply+' .waiting').hide();$(t.div_reply+' .error').hide();$(t.div_reply).hide();t.div_reply='';}
if(''!=t.div_actions){$(t.div_actions).show();t.div_actions='';}},open:function(blog_id,unique_id,note_id){var t=this;t.close();t.div_reply='#note-comment-reply-'+blog_id+'-'+unique_id;t.div_actions='#note-'+note_id+' .comment-actions';$(t.div_reply).show();$(t.div_reply+' .note-comment-reply-text').focus();$(t.div_actions).hide();},send:function(button){var t=this;var post={};var ajaxurl=button.attr('href');$(t.div_reply+' .error').hide();$(t.div_reply+' .waiting').show();if(button.attr('data-approve-comment'))
post.approve_parent='1';post.comment_ID=button.attr('data-comment-id');post.comment_post_ID=button.attr('data-post-id');post.user_ID=button.attr('data-user-id');post.blog_id=button.attr('data-blog-id');post.action='replyto_comment_note';post['_wpnonce']=button.attr('data-replyto-nonce');post.content=$(t.div_reply+' .note-comment-reply-text').val();$.ajax({type:'POST',url:ajaxurl,data:post,success:function(x){if(typeof(x)=='string'){t.error({'responseText':x});return false;}
$(t.div_reply+' .note-comment-reply-text')[0].value='';wpNotesCommentReply.close();},error:function(r){wpNotesCommentReply.error(r);}});},error:function(r){var t=this;var er=r.statusText;$(t.div_reply+' .waiting').hide();if(r.responseText)
er=r.responseText.replace(/<.[^<>]*?>/g,'');if(er)
$(t.div_reply+' .error').html(er).show();}};$(function(){wpNotesAdminBar.init()});})(jQuery);