$(document).ready(function () {
    $("#datepicker").datepicker({dateFormat: "dd.mm.yyyy"}).val();
    $("#datepicker").data('datepicker');
    $("#datepicker").data('form_birthday');


    $('#deliveryMethods').on('change', function () {
        console.log(this.value);
        $.ajax({
            url: '/cart/get-payment-methods',
            method: "GET",
            dataType: 'json',
            data: {delivery_method_id: this.value},
            success: function (methods) {
                $("#paymentMethods").empty();

                methods.forEach((method) => {
                    console.log(method.id);
                    let createOption = $('<option id="paymentMethod-' + method.id + '" value="' + method.id + '">' + method.label + '</option>');
                    $("#paymentMethods").append(createOption);
                })
            }
        })
    });

    $("#payForm").submit();

    $('input:radio[name=delivery_method]').on('change', function () {
        console.log(this.value);
        $.ajax({
            url: '/cart/get-payment-methods',
            method: "GET",
            dataType: 'json',
            data: {delivery_method_id: this.value},
            success: function (methods) {
                $("#paymentCard").empty();
                let counter = 1;
                console.log(typeof methods);
                console.log(methods);
                methods.forEach((method) => {
                    console.log(method);
                    let createDiv = $('<div class="form-check"></div>');
                    let createRadio = $('<input class="form-check-input payment_method_radio" type="radio" name="payment_method" id="payment_method-' + method.id + '" value="' + method.id + '" checked>');
                    let createLabel = $('<label class="form-check-label" for="payment_method-" ' + method.id + ' > ' + method.label + ' </label>');
                    createDiv.append(createRadio);
                    createDiv.append(createLabel);
                    //
                    $("#paymentCard").append(createDiv);

                    //
                    $("#collapsePaymentWrap").attr('aria-expanded', true).removeClass('collapsed');
                    $("#paymentCard").attr('aria-expanded', true).addClass('show');

                    $("#collapseDeliveryAdressWrap").attr('aria-expanded', true).removeClass('collapsed');
                    $("#collapseDeliveryAdress").attr('aria-expanded', true).addClass('show');

                    $("#userDataWrap").attr('aria-expanded', true).removeClass('collapsed');
                    $("#userData").attr('aria-expanded', true).addClass('show');
                    // console.log(123);
                })
            }
        })
    });


    $('#removeFavourite').click(() => {
        console.log('ok');
        let id = this.attr('title');
        console.log(id);
        addFavourite(id);
    });

    // $('#createOrderButton').click(function (e) {
    //     e.preventDefault();
    //     $.ajax({
    //         url: "/cart/create-order/",
    //         method: "POST",
    //         dataType: 'json',
    //         data: $('#createOrderForm').serialize(),
    //         success: function (date) {
    //             console.log(date);
    //             console.log('success')                // window.location.href = "http://138.68.125.45/";
    //             // $.ajax({
    //             //     url: "/cart/order-info/",
    //             //     method: "GET",
    //             //     dataType: 'json',
    //             // })
    //         },
    //         error: function (date) {
    //             console.log('error');
    //             let el = $('#createOrderErrorMessages');
    //             $('.form-control').removeClass('is-invalid');
    //             el.removeAttr('hidden');
    //             date = date.responseJSON;
    //             console.log(date);
    //             date.errorMessages.forEach((error) => {
    //                 $(`.form-control[name="${error.param}"]`).addClass('is-invalid');
    //                 el.html(error.msg);
    //             });
    //             // let el = $('#invalidOrder-payment_method').html(date.errorMessages);
    //         }
    //     })
    // });


    $('#sendRatingButton').click(function (e) {
        let id = $('#aromat_page_id').val();
        console.log(id);
        e.preventDefault();
        $.ajax({
            url: "/add-rating/" + id,
            method: "POST",
            dataType: 'json',
            data: {
                comment: $('#ratingComment').val(),
                rating: $('#ratingValue').val(),
            },
            success: function (date) {
                console.log(date);
                console.log('ok');
                $('#ratingsTab').attr('aria-selected', true);
                $('#sendRatingForm').hide();
                $('#ratingSendSuccess').removeAttr('hidden');
            },
            error: function (date) {
                let data = date.responseJSON;
                console.log(data);
                $('#ratingsTab').attr('aria-selected', true);
                if (data.errorMessages) {
                    $('#ratingComment').addClass('is-invalid');
                    $('#invalidRatingComment').html(data.errorMessages[0].msg);
                }
            }
        })
    });

    $('#subscribeSend').click(function (e) {
        let id = $('#aromat_page_id').val();
        console.log(id);
        e.preventDefault();
        $.ajax({
            url: "/subscribe",
            method: "POST",
            dataType: 'json',
            data: {
                email: $('#subscribeEmail').val(),
            },
            success: function (date) {
                $('#subscribeSuccess').removeAttr('hidden');
                $('#invalidSubscribe').html('');
                $('#subscribeEmail').removeClass('is-invalid');
            },
            error: function (date) {
                let data = date.responseJSON;
                if (data.errorMessages) {
                    $('#subscribeEmail').addClass('is-invalid');
                    $('#invalidSubscribe').html(data.errorMessages[0].msg);
                    $('#subscribeSuccess').attr('hidden', true);
                }
            }
        })
    });


    $('.priceButtonBox').click(function (e) {
        e.preventDefault();
        let id = $(this).data('product');
        $(this).parent().find('.priceButtonBox').removeClass('active');
        $(this).addClass('active');

        let thisPriceBox = $(this).closest('#priceCollapse');
        console.log(thisPriceBox);
        thisPriceBox.find('.price:not(#priceblock-' + id + ')').hide();
        thisPriceBox.find('#priceblock-' + id).show();

        // let thisBuyButtonBox = $(this).closest('.card-footer');
        let thisBuyButtonBox = $(this).closest('.accordion').next();
        console.log(thisBuyButtonBox);

        thisBuyButtonBox.find('.buy_button:not(#buyButtion-' + id + ')').hide();
        thisBuyButtonBox.find('#buyButtion-' + id).show();


        console.log('show');
    });

    $('[data-toggle="popover"]').popover();
    $('#search_popover_button').popover({
        html: true,
        content: '...',
    }).on('shown.bs.popover', function () {
        let id = $(this).attr('aria-describedby');
        $(`#${id} .popover-body`).html($('#search_popover').html());
    });

    $('#cart_button, #fav_button').on('shown.bs.popover', function () {
        new SimpleBar(document.getElementById('cart_popover_items'));
    });

    $('.megamenu-link').click(function (e) {

        e.preventDefault();
        let target = $($(this).data('menu'));
        target.slideToggle();
    });
    $('#accordionFilters > ul > li > .nav-link').click(function (e) {
        console.log(1);
        e.preventDefault();
        let target = $($(this).data('menu'));
        target.slideToggle();
    });

    $("#product_rating_text").click(function () {
        $(this).attr('disabled', false);
        $("#product_tabs > li:nth-child(1) > a").attr('disabled', true).attr('aria-selected', false).removeClass('active show');
        $("#product_tabs > li:nth-child(2) > a").attr('disabled', true).attr('aria-selected', false).removeClass('active show');
        $('#ratingsTab').attr('aria-selected', true).addClass('active show');
        $('#description').removeClass('show active');
        $('#seasons').removeClass('show active');
        $('#reviews').addClass('show active');

    });


    $("#aromat_page_description_button").click(function () {
        $(this).attr('disabled', true).siblings().attr('disabled', false);
        $("#product_rating_text").attr('disabled', false).attr('area-selected', false).removeClass('active');
    });

    $("#product_tabs > li:nth-child(1) > a").click(function () {
        $("#product_rating_text").attr('disabled', false).attr('area-selected', false).removeClass('active');
        $(this).attr('disabled', true).siblings().attr('disabled', false);
    });

    $("#product_tabs > li:nth-child(2) > a").click(function () {
        $("#product_rating_text").attr('disabled', false).attr('area-selected', false).removeClass('active');
    });

    $("#aromat_page_season_button").click(function () {
        $(this).attr('disabled', true).siblings().attr('disabled', false);
        $("#product_rating_text").attr('disabled', false).attr('area-selected', false).removeClass('active');

        $("#aromat_page_season").css('display', 'block').siblings().css('display', 'none')
    });

    if ($("#deliveryMethods").val() == 3) {
        $("#createOrderForm > div > div.col > div:nth-child(9) > label").html('Адрес самовывоза');
        $("#validationDefault04").val('Петровка ул., 2, Москва').attr('readonly', true)
    }

    $("#aromat_page_ratings_button").click(function () {
        $("#product_rating_text").attr('disabled', true);
        $(this).attr('disabled', true).siblings().attr('disabled', false);
        $("#aromat_page_ratings").css('display', 'block').siblings().css('display', 'none')
    });

    // console.log($("#deliveryMethods").val());


    $("#sendPromo").click((e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.

        let totalPrice = parseInt($("#totalPrice").text());

        console.log(totalPrice);
        let promocode = $('input[id="inputPromo"]').val();
        console.log(promocode);

        $.ajax({
            url: "/cart/apply-promo-code",
            method: "POST",
            data: {promocode: promocode, totalPrice: totalPrice},
            success: function (date) {

                // console.log(date);
                console.log(date);
                if (date.errorMessages) {
                    console.log(date.errorMessages[0].msg);
                    $('#inputPromo').addClass('is-invalid');
                    $('#invalidPromo').html(date.errorMessages[0].msg);
                }
                else {
                    $("#totalPrice").text((index, text) => {
                        text = date.newPrice + ' руб.';
                        return text;
                    });
                    $('input[id="inputPromo"]').val('');
                    $('input[id="inputPromo1"]').val(date.newPrice);
                    $('#inputPromo').prop('readonly', true);
                    $('#inputPromo').prop('placeholder', "Скидка уже применена");
                }
            }
        })
    });


    $('#updateUserButton').click(function (e) {
        let id = $('#updateUserId').val();
        e.preventDefault();
        $.ajax({
            url: "/account/update/" + id,
            method: "POST",
            dataType: 'json',
            data: $('#updateUserForm').serialize(),
            success: function (date) {
                $("#updateUserErrorMessages").empty();
                let successMsg = $('<div class="alert alert-success" role="alert">Информация успешно обновлена, для обновления перезайте в аккаунт</div>');
                $("#updateUserErrorMessages").append(successMsg);

            },
            error: function (date) {
                $("#updateUserErrorMessages").empty();
                date = date.responseJSON;
                date.errorMessages.forEach((error) => {
                    let errorMsg = $('<div class="alert alert-danger" role="alert">' + error.msg + "</div>");
                    //
                    $("#updateUserErrorMessages").append(errorMsg);
                })
            }
        });
    });

    $('#accordionFilters > ul > li > a').click(function () {

        let id = $(this).attr('data-menu');
        id = id.substr(1);
        console.log(id);
        $('.filters-group:not(#' + id + ')').css('display', 'none');
    });

    $('#menu_toggler').click(function (e) {
        $('body').toggleClass('slidemenu_shown');
    });
// $('section.awSlider .carousel').carousel({
//     pause: "hover",
//     interval: 5000
// });
//
// var startImage = $('section.awSlider .item.active > img').attr('src');
// $('section.awSlider').append('<img src="' + startImage + '">');
//
// $('section.awSlider .carousel').on('slid.bs.carousel', function () {
//     var bscn = $(this).find('.item.active > img').attr('src');
//     $('section.awSlider > img').attr('src', bscn);
// });

    if ($(document).height() <= $(window).height())
        $("footer.footer").addClass("navbar-fixed-bottom");
});

function pickupAdress() {
    console.log($("#deliveryMethods").val());
    if ($("#deliveryMethods").val() == 3) {
        $("#createOrderForm > div > div.col > div:nth-child(9) > label").html('Адрес самовывоза');
        $("#validationDefault04").val('г.Москва, ул.Михайловская, д.63Б, стр.2').attr('readonly', true)
    }
    else {
        $("#createOrderForm > div > div.col > div:nth-child(9) > label").html('Адрес доставки');
        $("#validationDefault04").val('').attr('readonly', false)
    }

    if ($("#deliveryMethods").val() == 4) {
        $('#default-city').attr('hidden', true);
        $('#default-city').attr('disabled', true);
        $('#sdek-city').attr('hidden', false)
    } else {
        $.ajax({
            url: '/cart/remove-delivery-price',
            method: "POST",
            success: function (cart) {
                $('#delivery-cost').attr('hidden', true)

            }
        });
        $('#default-city').attr('hidden', false);
        $('#default-city').attr('disabled', false);
        $('#sdek-city').attr('hidden', true)
    }
}

function addFavourite(id) {
    let qty = parseInt($('#favorite_quantity').html());
    console.log(id);
    $.ajax({
        url: '/add-favorite/',
        method: "GET",
        data: {id: id},
    })
        .done(function (data) {
            console.log('GET: ', JSON.stringify(data));
            if (data == "delete") {
                $(".heart" + id).attr("src", "../imgs/heart-white.png");
                $('#favorite_quantity').html(qty - 1);
                if (window.location.pathname === '/account/favourites') {
                    console.log('Удалить элемент')
                }
            }
            else {
                $(".heart" + id).attr("src", "../imgs/heart-black.png");
                $('#favorite_quantity').html(qty + 1);
            }

        });
}

function addToCart(id, params) {
    let container = $('#buy_modal');
    let content = container.find('.modal-content > .modal-body');
    let title = container.find('.modal-content > .modal-header');
    // let qty = parseInt($('.dropdown-toggle .favorite-quantity').html()) ;
    let req = {id: id};
    if (params) req.params = params;
    $.ajax({
        url: '/cart/' + id,
        method: "GET",
        data: req,
        success: function (cart) {
            console.log(cart);
            content.html(cart);

            title.html('Товар успешно добавлен в корзину');
            container.modal('show');
        }
    })
}

function minusLastProductDialog(id) {
    $('#minusLastProduct' + id).modal('show');
}

function minusProduct(id, dest) {
    let isLast = parseInt($('#quantityProductCart' + id).html());
    if (isLast === 1) {
        minusLastProductDialog(id)
    }
    else {
        changeQuantityThisProduct(id, dest)
    }
}

function changeQuantityThisProduct(id, dest) {
    if (!dest) dest = 'inc'; // or dec
    let target_container = $('.cart_item[data-item="' + id + '"]');
    $.ajax({
        url: '/cart/change-qty/' + id,
        method: "GET",
        dataType: 'json',
        data: {id: id, destination: dest},
        success: function (val) {
            if (val.quantity > 0) {
                target_container.find('.quantity-num').html(val.quantity);
                $('#totalProductPrice span').html(val.sum);
                $('#totalPrice span').html(val.promocodePrice);
            }
            else {
                $('#totalProductPrice span').html(val.sum);
                $('#totalPrice span').html(val.promocodePrice);

                let cart_badge = parseInt($('#cart_quantity').text()) - 1;
                $('#cart_quantity').text(cart_badge);

                target_container.next().remove();
                target_container.remove();
                if (val.sum == 0) {
                    $(location).attr('href', "/");
                }


            }
        }
    });
}

function gey_aromat(aromat_id) {
    // let qty = parseInt($('.dropdown-toggle .favorite-quantity').html()) ;
    console.log('корзина');
    $.ajax({
        url: '/aromat-page/:aromat_id',
        method: "GET",
        data: {aromat_id: aromat_id},
    })
        .done(function (data) {
        });

}


