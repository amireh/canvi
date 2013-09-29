/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Canvi\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-store' : '&#xe000;',
			'icon-out' : '&#xe001;',
			'icon-in' : '&#xe002;',
			'icon-in-alt' : '&#xe003;',
			'icon-home' : '&#xe004;',
			'icon-light-bulb' : '&#xe005;',
			'icon-anchor' : '&#xe006;',
			'icon-feather' : '&#xe007;',
			'icon-expand' : '&#xe008;',
			'icon-maximize' : '&#xe009;',
			'icon-search' : '&#xe00a;',
			'icon-zoom-in' : '&#xe00b;',
			'icon-zoom-out' : '&#xe00c;',
			'icon-add' : '&#xe00d;',
			'icon-subtract' : '&#xe00e;',
			'icon-exclamation' : '&#xe00f;',
			'icon-question' : '&#xe010;',
			'icon-close' : '&#xe011;',
			'icon-cmd' : '&#xe012;',
			'icon-forbid' : '&#xe013;',
			'icon-book' : '&#xe014;',
			'icon-spinner' : '&#xe015;',
			'icon-play' : '&#xe016;',
			'icon-stop' : '&#xe017;',
			'icon-pause' : '&#xe018;',
			'icon-forward' : '&#xe019;',
			'icon-rewind' : '&#xe01a;',
			'icon-sound' : '&#xe01b;',
			'icon-sound-alt' : '&#xe01c;',
			'icon-sound-off' : '&#xe01d;',
			'icon-task' : '&#xe01e;',
			'icon-inbox' : '&#xe01f;',
			'icon-inbox-alt' : '&#xe020;',
			'icon-envelope' : '&#xe021;',
			'icon-compose' : '&#xe022;',
			'icon-newspaper' : '&#xe023;',
			'icon-newspaper-alt' : '&#xe024;',
			'icon-clipboard' : '&#xe025;',
			'icon-calendar' : '&#xe026;',
			'icon-hyperlink' : '&#xe027;',
			'icon-trash' : '&#xe028;',
			'icon-trash-alt' : '&#xe029;',
			'icon-grid' : '&#xe02a;',
			'icon-grid-alt' : '&#xe02b;',
			'icon-menu' : '&#xe02c;',
			'icon-list' : '&#xe02d;',
			'icon-gallery' : '&#xe02e;',
			'icon-calculator' : '&#xe02f;',
			'icon-windows' : '&#xe030;',
			'icon-browser' : '&#xe031;',
			'icon-alarm' : '&#xe032;',
			'icon-clock' : '&#xe033;',
			'icon-attachment' : '&#xe034;',
			'icon-settings' : '&#xe035;',
			'icon-portfolio' : '&#xe036;',
			'icon-user' : '&#xe037;',
			'icon-users' : '&#xe038;',
			'icon-heart' : '&#xe039;',
			'icon-chat' : '&#xe03a;',
			'icon-comments' : '&#xe03b;',
			'icon-screen' : '&#xe03c;',
			'icon-iphone' : '&#xe03d;',
			'icon-ipad' : '&#xe03e;',
			'icon-fork-and-spoon' : '&#xe03f;',
			'icon-fork-and-knife' : '&#xe040;',
			'icon-instagram' : '&#xe041;',
			'icon-facebook' : '&#xe042;',
			'icon-delicious' : '&#xe043;',
			'icon-googleplus' : '&#xe044;',
			'icon-dribbble' : '&#xe045;',
			'icon-pin' : '&#xe046;',
			'icon-pin-alt' : '&#xe047;',
			'icon-camera' : '&#xe048;',
			'icon-brightness' : '&#xe049;',
			'icon-brightness-half' : '&#xe04a;',
			'icon-moon' : '&#xe04b;',
			'icon-cloud' : '&#xe04c;',
			'icon-circle-full' : '&#xe04d;',
			'icon-circle-half' : '&#xe04e;',
			'icon-globe' : '&#xe04f;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};