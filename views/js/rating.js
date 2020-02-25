$(document).ready(function(){
    function move(e, obj){
        var id = obj.next().attr('id').substr(1);
        var progress = e.pageX - obj.offset().left;
        var rating = progress * 5 / $('.stars').width();
        $('#param'+id).text(rating.toFixed(1));
        obj.next().width(progress);

    }

    $('#rating .stars').click(function(e){
        $(this).toggleClass('fixed');
        move(e, $(this));
    });

    $('#rating .stars').on('mousemove', function(e){
        if ($(this).hasClass('fixed')==false) move(e, $(this));
    });

    // $('#rating [type=submit]').click(function(){
    //     summ = parseFloat($('#summ').text());
    //     jQuery.post('change_rating.php', {
    //         obj_id: $(this).attr('id').substr(3),
    //         rating: summ
    //     }, notice);
    // });

    function notice(text){
        $('#message').fadeOut(500, function(){ $(this).text(text); }).fadeIn(2000);
    }
});