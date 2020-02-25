var cdek_val = 0;

$(document).ready(function () {
    console.log($("#deliveryMethods").val());
    if ($("#deliveryMethods").val() == 4) {
        $('#default-city').attr('hidden', true);
        $('#default-city').attr('disabled', true);
        $('#sdek-city').attr('hidden', false);
        $('#delivery-cost').attr('hidden', false);
        $.ajax({
            url: '/cart/get-payment-methods',
            method: "GET",
            dataType: 'json',
            data: {delivery_method_id: $("#deliveryMethods").val()},
            success: function (methods) {
                $("#paymentMethods").empty();

                methods.forEach((method) => {
                    console.log(method.id);
                    let createOption = $('<option id="paymentMethod-' + method.id + '" value="' + method.id + '">' + method.label + '</option>');
                    $("#paymentMethods").append(createOption);
                })
            }
        })
    } else {
        $('#default-city').attr('hidden', false);
        $('#default-city').attr('disabled', false);
        $('#sdek-city').attr('hidden', true)
    }


    $('#city_input').autoComplete({
        resolver: 'custom',
        events: {
            search: function (query, cb) {
                $.ajax({
                    url: "http://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
                    dataType: "jsonp",
                    type: "POST",
                    data: {
                        q: function () {
                            return $("#city_input").val()
                        },
                        name_startsWith: function () {
                            return $("#city_input").val()
                        }
                    },
                    success: function (data) {
                        console.log(data);
                        cb(data.geonames.map(item => Object.assign({}, {id: item.id, text: item.cityName})));
                    }
                });
            },
        },
    });
    $('#city2_input').autoComplete({

        resolver: 'custom',
        events: {
            search: function (query, cb) {
                $.ajax({
                    url: "http://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
                    dataType: "jsonp",
                    type: "POST",
                    data: {
                        q: function () {
                            console.log($("#city2_input").val());

                            return $("#city2_input").val()
                        },
                        name_startsWith: function () {
                            console.log($("#city2_input").val());
                            return $("#city2_input").val()
                        }
                    },
                    success: function (data) {
                        console.log(data);
                        cb(data.geonames.map(item => Object.assign({}, {id: item.id, text: item.cityName})));
                    }
                });
            },
        },
    });
    $('#city_input').on('autocomplete.select', function (evt, item) {
        console.log(item);
        console.log(evt);
        $('#city_input_id').val(item.id);
    });

    $('#city2_input').on('autocomplete.select', function (evt, item) {
        console.log(item);
        $('#city2_input_id').val(item.id);
    });


    $('#sdekcalculate').click(function (e) {
        var formData = form2js('sdekform', '.', true, function (node) {
            if (node.id && node.id.match(/callbackTest/)) {
                return {
                    name: node.id,
                    value: node.innerHTML
                };
            }
        });
        var formDataJson = JSON.stringify(formData);
        console.log(formData);
        e.preventDefault();

        $.ajax({
            url: 'http://api.edostavka.ru/calculator/calculate_price_by_jsonp.php',
            jsonp: 'callback',
            data: {
                "json": formDataJson
            },
            type: 'GET',
            dataType: "jsonp",
            success: function (data) {
                if (data.hasOwnProperty("result")) {
                    $('#sdekresult').html(
                        `
                            Цена доставки <b>${data.result.price} руб.</b><br/>
                            Срок доставки ${data.result.deliveryPeriodMin} - ${data.result.deliveryPeriodMax} дн. <br/>
                            Планируемая дата доставки ${data.result.deliveryDateMin} - ${data.result.deliveryDateMax} <br/>
                        `
                    );
                } else {
                    $('#sdekresult').html('');
                    for (var key in data["error"]) {
                        $('#sdekresult').append('Ошибка: ' + data["error"][key].text + '<br /><br />');
                    }
                }
            }
        });
        $.ajax({
            url: 'http://api.edostavka.ru/calculator/calculate_price_by_jsonp.php',
            jsonp: 'callback',
            data: {
                "json": formDataJson
            },
            type: 'GET',
            dataType: "jsonp",
            success: function (data) {

            }
        });
    });

    $('#sdekAddItem').click(function (e) {

        e.preventDefault();
        console.log('message');
        let container = $('#sdekItems');
        let template = $('#sdekItemTpl .col-12:first-child').html();
        let pattern = new RegExp(`\\[0\\]`, "g");


        let ns = template.replace(pattern, '[' + (++cdek_val) + ']');

        let item = $('<div class="row mt-2"><div class="col-12"></div></div>');
        item.find('.col-12:first-child').html(ns);
        item.find('.col-12:first-child').append('<a href="#" class="btn btn-sdek-remove d-inline-block">Удалить</a>');
    container.append(item);
    console.log(item)
});

    $('#sdekItems').on('click', '.btn-sdek-remove', function (e) {
        e.preventDefault();
        $(this).closest('.row').remove();
    });


    $('#city4_input').autoComplete({

        resolver: 'custom',
        events: {
            search: function (query, cb) {
                $.ajax({
                    url: "http://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
                    dataType: "jsonp",
                    type: "POST",
                    data: {
                        q: function () {

                            return $("#city4_input").val()
                        },
                        name_startsWith: function () {
                            return $("#city4_input").val()
                        }
                    },
                    success: function (data) {
                        cb(data.geonames.map(item => Object.assign({}, {id: item.id, text: item.cityName})));
                    }
                });
            },
        },
    });

    $('#city4_input').on('autocomplete.select', function (evt, item) {

        let goods_quantity = $('#hidden_quantity').html();
        $('#city3_input_id').val("44");
        $('#city3_input').val("Москва");
        $('#city4_input_id').val(item.id);

        var formData = form2js('createOrderForm', '.', true, function (node) {
            if (node.id && node.id.match(/callbackTest/)) {
                return {
                    name: node.id,
                    value: node.innerHTML
                };
            }
        });
        formData.goods[0].weight = formData.goods[0].weight * goods_quantity;
        formData.goods[0].length = formData.goods[0].length * goods_quantity;
        formData.goods[0].width = formData.goods[0].width * goods_quantity;
        formData.goods[0].height = formData.goods[0].height * goods_quantity;

        var formDataJson = JSON.stringify(formData);
        let delivery_price = 0;
        let deliveryPeriodMin = 0;
        let deliveryPeriodMax = 0;
        let deliveryDateMin = null;
        let deliveryDateMax = null;
        console.log('дошли');

        $.ajax({
            url: 'http://api.edostavka.ru/calculator/calculate_price_by_jsonp.php',
            jsonp: 'callback',
            data: {
                "json": formDataJson
            },
            type: 'GET',
            dataType: "jsonp",
            success: function (data) {
                if (data.hasOwnProperty("result")) {
                    delivery_price = data.result.price;
                    deliveryPeriodMin = data.result.deliveryPeriodMin;
                    deliveryPeriodMax = data.result.deliveryPeriodMax;
                    deliveryDateMin = data.result.deliveryDateMin;
                    deliveryDateMax = data.result.deliveryDateMax;
                    console.log('дошли2');
                    console.log($('#city4_input').val());
                    $.ajax({
                        url: '/cart/add-delivery-price',
                        method: "POST",
                        data: {
                            delivery_price: delivery_price,
                            delivery_city: $('#city4_input').val()
                        },
                        success: function (session_delivery_price) {
                            let totalSum = parseInt(delivery_price) + parseInt($('#help-sum-price').html());

                            $('#delivery-cost').html(
                                `Cтоимость доставки: ${session_delivery_price} руб.  <br/>
                                 Срок доставки ${deliveryPeriodMin} - ${deliveryPeriodMax} дн. <br/>
                                 Планируемая дата доставки ${deliveryDateMin} - ${deliveryDateMax} <br/>
                               <b>   Общая сумма заказа: ${totalSum} руб.</b>  <br/>
                                `);
                            $('#delivery-cost').attr('hidden', false);


                        }
                    })

                } else {
                    $('#delivery-cost').html('');
                    for (var key in data["error"]) {
                        $('#delivery-cost').append('Ошибка: ' + data["error"][key].text + '<br /><br />');
                    }
                }
            }
        });


    });

});


