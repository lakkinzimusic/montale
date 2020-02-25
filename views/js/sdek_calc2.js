var cdek_val = 0;

$(document).ready(function () {

    $('#city3_input').autoComplete({

        resolver: 'custom',
        events: {
            search: function (query, cb) {
                $.ajax({
                    url: "http://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
                    dataType: "jsonp",
                    type: "POST",
                    data: {
                        q: function () {
                            console.log($("#city3_input").val());

                            return $("#city3_input").val()
                        },
                        name_startsWith: function () {
                            console.log($("#city3_input").val());
                            return $("#city3_input").val()
                        }
                    },
                    success: function (data) {
                        console.log(data);
                        cb(data.geonames.map(item => Object.assign({}, {id:item.id, text:item.cityName})));
                    }
                });
            },
        },
    });
    // $('#city_input3').on('autocomplete.select', function (evt, item) {
    //     console.log(item);
    //     $('#city_input_id3').val(item.id);
    // });
    $('#city3_input').on('autocomplete.select', function (evt, item) {
        console.log(item);
        $('#city3_input_id').val(item.id);
    });

    $('#sdekcalculate').click(function(e){
        var formData = form2js('sdekform', '.', true, function(node) {
            if(node.id && node.id.match(/callbackTest/)) {
                return {
                    name : node.id,
                    value : node.innerHTML
                };
            }
        });
        var formDataJson = JSON.stringify(formData);
        e.preventDefault();
        $.ajax({
            url : 'http://api.edostavka.ru/calculator/calculate_price_by_jsonp.php',
            jsonp : 'callback',
            data : {
                "json" : formDataJson
            },
            type : 'GET',
            dataType : "jsonp",
            success : function(data) {
                if(data.hasOwnProperty("result")) {
                    $('#sdekresult').html(
                        `
                            Цена доставки <b>${data.result.price} руб.</b><br/>
                            Срок доставки ${data.result.deliveryPeriodMin} - ${data.result.deliveryPeriodMax} дн. <br/>
                            Планируемая дата доставки ${data.result.deliveryDateMin} - ${data.result.deliveryDateMax} <br/>
                        `
                    );
                } else {
                    $('#sdekresult').html('');
                    for(var key in data["error"]) {
                        $('#sdekresult').append('Ошибка: ' + data["error"][key].text + '<br /><br />');
                    }
                }
            }
        });
    });

    // $('#sdekAddItem').click(function(e){
    //     e.preventDefault();
    //     let container = $('#sdekItems');
    //     let template = $('#sdekItemTpl .col:first-child').html();
    //     let pattern = new RegExp(`\\[0\\]`, "g");
    //     let ns = template.replace(pattern, '['+(++cdek_val)+']');
    //     let item = $('<div class="row mt-2"><div class="col"></div></div>');
    //     item.find('.col:first-child').html(ns);
    //     item.find('.col:first-child').append('<a href="#" class="btn btn-sdek-remove d-inline-block">Удалить</a>');
    //     container.append(item);
    // });

    $('#sdekItems').on('click', '.btn-sdek-remove', function(e){
        e.preventDefault();
        $(this).closest('.row').remove();
    });
});


