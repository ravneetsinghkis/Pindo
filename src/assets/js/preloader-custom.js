const tlY1 = new TimelineMax({repeat: -1}),
			tlX1 = new TimelineMax({repeat: -1}),
			tlY2 = new TimelineMax({repeat: -1}),
			tlX2 = new TimelineMax({repeat: -1}),
			letters = new TimelineMax();

TweenMax.set('.big-circle', {scaleX: 0.995, scaleY: 0.995, transformOrigin: "50%, 50%"});
TweenMax.set('.icon-wrapper, .dot', {visibility: "visible"});
tlY1.fromTo("#start", 2, {y: "10%"}, {y: "-87%", repeat: -1, delay: 1, yoyo: true, ease: Power0.easeNone});
tlX1.to("#start", 1, {x: "-100%", repeat: -1, ease: Power0.easeNone});
tlY2.fromTo("#end", 2, {y: "10%"}, {y: "-87%", repeat: -1, delay: 1, yoyo: true, ease: Power0.easeNone});
tlX2.to("#end", 1, {x: "-100%", repeat: -1, ease: Power0.easeNone});
letters
	.set('.letter', {visibility: "visible"})
	.staggerFrom('.letter', 2, {opacity: 0, ease: Power1.easeOut}, 0.15);
TweenMax.from('.dot', 1, {scaleX: 0, scaleY: 0, transformOrigin: "50%, 50%", ease: Back.easeOut.config(4), delay: 1});
