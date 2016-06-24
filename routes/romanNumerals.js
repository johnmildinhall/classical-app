roman_to_int = function (input) {
    var i, pos = 0,
        result = 0,
        get_one_power_of_ten = function (str, pos, current_pot) {
            // Current power-of-ten accumulator: collects characters belonging to one power-of-ten. Eg: "IX", "VII", etc.
            var i, current_pot_acc = "",
                numeral_to_template = function (ch) {
                    // converts char ch to power-of-ten idependant template character.
                    if (ch === digits[current_pot][0]) {
                        return "o";
                    }
                    if (ch === digits[current_pot][1]) {
                        return "f";
                    }
                    // we also allow for the "X" in something like "IX". (representations of 9*10^n).
                    if ((current_pot < (digits.length - 1)) && (current_pot_acc === "o") && (ch === digits[current_pot + 1][0])) {
                        return "t";
                    }
                    return "";
                };
            for (i = pos; i < input.length; i++) {
                if (numeral_to_template(input.charAt(i)) !== "") {
                    current_pot_acc += numeral_to_template(input.charAt(i));
                    pos++;
                } else {
                    break;
                }
            }
            return [current_pot_acc, pos];

        };

    input = input.toUpperCase();
    for (i = digits.length - 1; i >= 0; i--) {
        // we iterate over the powers of ten in decreasing order, starting with 3 (which is 1000).
        var templ_ix, pot = get_one_power_of_ten(input, pos, i);
        pos = pot[1], templ_ix = templates.indexOf(pot[0]);
        if (templ_ix === -1) {
            throw ("invalid roman numeral");
        } else {
            result += templ_ix * Math.pow(10, i);
        }
    }
    if (pos !== input.length) throw ("invalid char at position " + pos);
    return result;
};