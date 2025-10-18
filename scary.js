document.addEventListener("DOMContentLoaded", () => {
	const frame = document.querySelector(".video-frame");
	const id = frame.dataset.videoId;
	if (!id) return;

	const start = Number(frame.dataset.start || 0);
	const earlyCut = Number(frame.dataset.earlycut || 11);

	const iframe = document.createElement("iframe");
	iframe.id = "yt-embed";
	iframe.allow = "autoplay; encrypted-media; picture-in-picture";
	iframe.allowFullscreen = true;
	iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=${start}`;
	frame.appendChild(iframe);

	function init() {
		const player = new YT.Player("yt-embed", {
			events: {
				onReady: (e) => {
					e.target.mute();
					e.target.seekTo(start, true);
					e.target.playVideo();
					iframe.style.opacity = "1";
				},
				onStateChange: (e) => {
					if (e.data === YT.PlayerState.ENDED) e.target.seekTo(start, true);
				}
			}
		});

		let loopEnd = null;
		const tick = setInterval(() => {
			if (!loopEnd) {
				const d = player.getDuration ? player.getDuration() : 0;
				if (d > 0) loopEnd = Math.max(start, d - earlyCut);
			}
			if (
				player.getPlayerState &&
				player.getPlayerState() === YT.PlayerState.PLAYING
			) {
				const t = player.getCurrentTime ? player.getCurrentTime() : 0;
				if (loopEnd && t >= loopEnd - 0.15) player.seekTo(start, true);
			}
		}, 120);
	}

	if (!(window.YT && window.YT.Player)) {
		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		document.head.appendChild(tag);
		window.onYouTubeIframeAPIReady = init;
	} else {
		init();
	}
});