/**
 * These puzzles belong to the orignal author of Return True To Win.
 * https://alf.nu/ReturnTrue
 */


// submitted by James
function countOnMe(x) {
    if (!(x instanceof Array))
        throw 'x must be an array.';

    for (var i = 0; i < 20; i++) {
	if (x[i] != i) {
            throw 'x must contain the numbers 0-19 in order';
	}
    }

    return true;
}