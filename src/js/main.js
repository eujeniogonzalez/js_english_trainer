const slider = document.querySelector('.slider')
const sliderLine = document.querySelector('.slider_line')
const sliderItems = document.querySelectorAll('.slider_line_item')
const sliderItem = document.querySelector('.slider_line_item')

const nextButton = document.querySelector('.slider_btn_next')
const prevButton = document.querySelector('.slider_btn_prev')
const sliderBullets = document.querySelector('.slider_bullets')

let currentSlideNumber = 1

// Add quantity of slides
document.querySelector('#total_word_number').innerHTML = sliderItems.length - 1

// Create bullets
function createNewWordSliderBullets() {

	let i = 1
	while (i <= sliderItems.length) {
	
		if (i === 1) {
			sliderBullets.innerHTML += '<div id = "slider_bullet_id_' + i + '" class="slider_bullets_item slider_bullets_item_active"></div>'
		} else {
			sliderBullets.innerHTML += '<div id = "slider_bullet_id_' + i + '" class="slider_bullets_item"></div>'
		}
		i++
	}
}
createNewWordSliderBullets()

// Slider width rounding
function roundSliderWidth() {
	let sliderWidth = +slider.getBoundingClientRect().width.toFixed(10)
	if (Number.isInteger(sliderWidth) === false) {
		slider.style.width = Math.round(sliderWidth) + 'px'
	}
}
roundSliderWidth()

// Watching for window resizing
window.addEventListener('resize', function(){
	slider.style.width = 100 + '%'
	roundSliderWidth()
	scrollSlider()
})

// Next button
function nextSlide () {
	
	if (currentSlideNumber < sliderItems.length) {
		currentSlideNumber++
		scrollSlider()
	}
	
	if (currentSlideNumber === sliderItems.length) {

		nextButton.disabled = true
		nextButton.classList.add('slider_btn_hidden')
		prevButton.classList.add('slider_btn_hidden')
		sliderBullets.classList.add('slider_bullets_hidden')

	} else {

		if (prevButton.disabled === true ) {
			prevButton.disabled = false
			prevButton.classList.remove('slider_btn_disabled')
		}
	}
}
nextButton.addEventListener('click', nextSlide)

// Previous button
function prevSlide () {

	if (currentSlideNumber > 1 && currentSlideNumber < sliderItems.length) {
		currentSlideNumber--
		scrollSlider()
	}

	if (currentSlideNumber === 1) {
		prevButton.disabled = true
		prevButton.classList.add('slider_btn_disabled')
	} else {
		if (nextButton.disabled === true ) {
			nextButton.disabled = false
		}
	}
}
prevButton.addEventListener('click', prevSlide)

// Keyboard
document.addEventListener('keyup', function(event) {
	if (event.key == 'ArrowLeft') {
		prevSlide()
	} else if (event.key == 'ArrowRight') {
		nextSlide()
	} else if (event.key == 'Shift') {
		hideWordFilter(currentSlideNumber)
	} else if (event.key == 'Enter') {
		repeatAfterFinish ()
	}
})

// Repeat button
function repeatAfterFinish () {

	if (currentSlideNumber === sliderItems.length) {
		
		// Reset slide number
		currentSlideNumber = 1

		// Show all word filters
		let allWordFilters = document.querySelectorAll('.word_filter')
		allWordFilters.forEach(item => {
			item.style.opacity = '1'
			item.style.cursor = 'pointer'
			item.style.transition = 'opacity 0s'
		})
		
		// Show all buttons and bullets
		nextButton.classList.remove('slider_btn_hidden')
		prevButton.classList.remove('slider_btn_hidden')
		sliderBullets.classList.remove('slider_bullets_hidden')
		
		prevButton.disabled = true
		prevButton.classList.add('slider_btn_disabled')
		nextButton.disabled = false
		
		changeActiveBullet()

		scrollSlider()
	}
}
document.querySelector('.repeat_button').addEventListener('click', repeatAfterFinish)

// Scrolling the slider
function scrollSlider() {

	sliderLine.style.transform = 
		'translate(-' + ((currentSlideNumber - 1) * +sliderItem.getBoundingClientRect().width.toFixed(10) + 
		(parseInt(getComputedStyle(sliderItem).marginRight) * (currentSlideNumber - 1))) + 'px)'

	changeActiveBullet()
}

// Change active bullet and counter value
function changeActiveBullet() {
	
	let allBullets = document.querySelectorAll('.slider_bullets_item')
	
	allBullets.forEach(item => {
		item.classList.remove ('slider_bullets_item_active')
	})
	
	document.querySelector('#slider_bullet_id_' + currentSlideNumber).classList.add ('slider_bullets_item_active')
	if (currentSlideNumber < sliderItems.length) {
		document.querySelector('#current_word_number').innerHTML = currentSlideNumber
	}
}

// Hide word filter
function hideWordFilter(filter_id) {
	if (currentSlideNumber < sliderItems.length) {
		let filter = document.getElementById('filter_id_' + filter_id)
		filter.style.opacity = '0'
		filter.style.cursor = 'default'
		filter.style.transition = 'opacity 0.5s'
	}
}

// Swipes
slider.addEventListener('touchstart', handleTouchStart, false)
slider.addEventListener('touchmove', handleTouchMove, false)

let xDown = null
let yDown = null

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0]
    xDown = firstTouch.clientX
    yDown = firstTouch.clientY
}
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return
    }

    let xUp = evt.touches[0].clientX
    let yUp = evt.touches[0].clientY

    let xDiff = xDown - xUp
    let yDiff = yDown - yUp
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
            // left swipe
			nextSlide()
        } else {
            // right swipe
			prevSlide()
        }                       
    }
    
    xDown = null
    yDown = null
}