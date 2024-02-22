module.exports = { isnum, range, isplaylist };

function isplaylist(link) {
	const isplay = link.toString().split('/').join().split('?').join().split('&').join().split('=').join().split(',');
	if (isplay[0] === 'https:') {
		if (isplay[3] !== 'playlist' && isplay[3] !== 'album' && isplay[6] !== 'list') {return true;}
		else {return false;}
	}
	else {return true;}
}

function isnum(args) {
	return isNaN(parseInt(args)) ? false : true
}

function range(length, args) {
	return length < parseInt(args) || parseInt(args) === 0 ? false : true
}