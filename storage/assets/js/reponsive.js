$(document).ready(function(){
    $('.item-menu').click(function(){
        $('.menu').slideToggle(150);
    });

    $('.item-cate').click(function(){
        $('.cate').slideToggle(150);
    });

  	$('.list-pr').addClass('hide');
    $('.list-pr').eq(0).removeClass('hide');
    $('.cate li').eq(0).find('a').addClass('active');
    $('.cate a').click(function(e){
        e.preventDefault()
        $('.cate a').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('href');
        $(id).removeClass('hide').siblings('div').addClass('hide');
    })

    $('body').on('click','.showby input[type="radio"]',function() {
        if($(this).attr('value') == "list"){
            $('#list').show();
            $('#grid').hide();
        }
        if($(this).attr('value') == "grid"){
            $('#list').hide();
            $('#grid').show();
        }
    });
});
