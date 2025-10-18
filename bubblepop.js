const bm = document.querySelector('#bubble_machine'),
			bcs = document.querySelector('#bubs_counter span'),
			bubble_item = ['🎃', '🧟','🕷️','👻','🦇'],
			bubble_rate = 100 //milliseconds per release

let bc = 0,
		bt = 10,
		run_timer

function addBubble() {
	var b = document.createElement('div')
	b.className = 'bubble'
	b.innerHTML = bubble_item[Math.floor(Math.random()*bubble_item.length)]
	let ww = (Math.random()*100) + 28
	b.style.fontSize = ww * .5 + 'px'
	b.style.width = ww + 'px'
	b.style.left = Math.random()*95 + '%'
	b.style.animationDuration = Math.floor(Math.random()*10) + 8 + 's'
	b.onclick = function() {		
		this.classList.add('pop_bubble')
		var pop = new Audio('http://contentservice.mc.reyrey.net/audio_v1.0.0/?id=e049b733-1543-51fd-9ce9-680f57226aa1')
		pop.play()

		if(document.querySelector('.show_timer')){
			bc++
			bcs.innerText = bc
		}

		if(!document.querySelector('.show_timer') && bc == 0) {
			bubs_timer.classList.add('show_timer')
			bcs.innerText = bc
			run_timer = setInterval(function(){
				bt--
				bubs_timer.innerText = bt

				if(bt == 0) {
					setTimeout(function(){
						bubs_timer.classList.remove('show_timer')
						clearInterval(run_timer)
						let bubs = document.querySelectorAll('.bubble')
						bubs.forEach(function(e){
							e.click()
						})
						setTimeout(function(){
							bc = 0
							bt = 10
							bubs_timer.innerText = bt
						}, 5000)
					}, 150)
				}
			}, 1000)
		}
	}
	b.onanimationend = function() {
		this.remove()
	}  
	bm.appendChild(b)

	setTimeout(addBubble, bubble_rate)
}

addBubble()
