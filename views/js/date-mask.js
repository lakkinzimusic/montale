window.onload = function () {
    var input = document.querySelectorAll('.dateinput')[0];
    String.prototype.replaceAt=function(index, replacement) {
        return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
    };
    var dateInputMask = function dateInputMask(elm) {
        console.log(elm);
        elm.addEventListener('keypress', function (e) {
            if (e.keyCode < 47 || e.keyCode > 57) {
                e.preventDefault();
            }

            var len = elm.value.length;

            // If we're at a particular place, let the user type the slash
            // i.e., 12/12/1212
            if (len !== 1 || len !== 3) {
                if (e.keyCode == 47) {
                    e.preventDefault();
                }
            }

            // If they don't add the slash, do it for them...
            if (len === 2) {
                elm.value += '.';
            }
            if(len > 1 && parseInt(elm.value.substring(0, 2)) > 31){
                elm.value =  '31' + elm.value.substring(2);
                console.log(elm.value[0])
            }

            // If they don't add the slash, do it for them...
            if (len === 5) {
                elm.value += '.';
            }

            if(len > 4 && parseInt(elm.value.substring(3, 5)) > 12){
                elm.value = elm.value.substring(0, 3) + '12.' + elm.value.substring(7);
            }
            if (len > 8 && parseInt(elm.value.substring(6)) > 2020) {
                console.log(parseInt(elm.value.substring(6)));
                elm.value = elm.value.substring(0, 6) + '2020'
            }
            if (len > 9) {
                e.preventDefault();
            }

        });
        elm.addEventListener('blur', function (e) {
            if(parseInt(elm.value.substring(0, 2)) > 31){
                elm.value =  '31' + elm.value.substring(2);
            }
            if(parseInt(elm.value.substring(3, 5)) > 12){
                elm.value = elm.value.substring(0, 3) + '12.' + elm.value.substring(7);
            }
            if (parseInt(elm.value.substring(6)) > 2020) {
                elm.value = elm.value.substring(0, 6) + '2020';
            }
            if(elm.value.charAt(3) !== '.' ||elm.value.charAt(3) !== '.' ){
                elm.value = elm.value.substring(0, 2) + '.' + elm.value.substring(3, 5) + '.' + elm.value.substring(6) ;
            }
       });
    };

    dateInputMask(input);

};