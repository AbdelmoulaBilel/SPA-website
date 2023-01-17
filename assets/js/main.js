

"use strict";


/*--
    Header Sticky
-----------------------------------*/
window.onscroll = function () {
    var left = document.getElementById("header");

    if (left.scrollTop > 50 || self.pageYOffset > 50) {
        left.classList.add("sticky")
    } else {
        left.classList.remove("sticky");
    }
}


/*--
    Menu parent Element Icon
-----------------------------------*/
const $subMenu = document.querySelectorAll('.sub-menu');
$subMenu.forEach(function (subMenu) {
    const menuExpand = document.createElement('span')
    menuExpand.classList.add('menu-icon')
    // menuExpand.innerHTML = '+'
    subMenu.parentElement.insertBefore(menuExpand, subMenu)
    if (subMenu.classList.contains('mega-menu')) {
        subMenu.classList.remove('mega-menu')
        subMenu.querySelectorAll('ul').forEach(function (ul) {
            ul.classList.add('sub-menu')
            const menuExpand = document.createElement('span')
            menuExpand.classList.add('menu-icon')
            menuExpand.innerHTML = '+'
            ul.parentElement.insertBefore(menuExpand, ul)
        })
    }
})


/*--
    Mobile Menu 

    Global Functions
    - Get Sibling
    - Slide Up
    - Slide Down
    - Slide Toggle
-----------------------------------*/

/* Get Sibling */
const getSiblings = function (elem) {
    const siblings = []
    let sibling = elem.parentNode.firstChild
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling)
        }
        sibling = sibling.nextSibling
    }
    return siblings
}

/* Slide Up */
const slideUp = (target, time) => {
    const duration = time ? time : 500;
    target.style.transitionProperty = 'height, margin, padding'
    target.style.transitionDuration = duration + 'ms'
    target.style.boxSizing = 'border-box'
    target.style.height = target.offsetHeight + 'px'
    target.offsetHeight
    target.style.overflow = 'hidden'
    target.style.height = 0
    window.setTimeout(() => {
        target.style.display = 'none'
        target.style.removeProperty('height')
        target.style.removeProperty('overflow')
        target.style.removeProperty('transition-duration')
        target.style.removeProperty('transition-property')
    }, duration)
}

/* Slide Down */
const slideDown = (target, time) => {
    const duration = time ? time : 500;
    target.style.removeProperty('display')
    let display = window.getComputedStyle(target).display
    if (display === 'none') display = 'block'
    target.style.display = display
    const height = target.offsetHeight
    target.style.overflow = 'hidden'
    target.style.height = 0
    target.offsetHeight
    target.style.boxSizing = 'border-box'
    target.style.transitionProperty = 'height, margin, padding'
    target.style.transitionDuration = duration + 'ms'
    target.style.height = height + 'px'
    window.setTimeout(() => {
        target.style.removeProperty('height')
        target.style.removeProperty('overflow')
        target.style.removeProperty('transition-duration')
        target.style.removeProperty('transition-property')
    }, duration)
}

/* Slide Toggle */
const slideToggle = (target, time) => {
    const duration = time ? time : 500;
    if (window.getComputedStyle(target).display === 'none') {
        return slideDown(target, duration)
    } else {
        return slideUp(target, duration)
    }
}

/* Offcanvas/Collapseable Menu */
const offCanvasMenu = function (selector) {

    const $offCanvasNav = document.querySelector(selector),
        $subMenu = $offCanvasNav.querySelectorAll('.sub-menu');
    $subMenu.forEach(function (subMenu) {
        const menuExpand = document.createElement('span')
        menuExpand.classList.add('menu-expand')
        // menuExpand.innerHTML = '+'
        subMenu.parentElement.insertBefore(menuExpand, subMenu)
        if (subMenu.classList.contains('mega-menu')) {
            subMenu.classList.remove('mega-menu')
            subMenu.querySelectorAll('ul').forEach(function (ul) {
                ul.classList.add('sub-menu')
                const menuExpand = document.createElement('span')
                menuExpand.classList.add('menu-expand')
                menuExpand.innerHTML = '+'
                ul.parentElement.insertBefore(menuExpand, ul)
            })
        }
    })

    $offCanvasNav.querySelectorAll('.menu-expand').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault()
            const parent = this.parentElement
            if (parent.classList.contains('active')) {
                parent.classList.remove('active');
                parent.querySelectorAll('.sub-menu').forEach(function (subMenu) {
                    subMenu.parentElement.classList.remove('active');
                    slideUp(subMenu)
                })
            } else {
                parent.classList.add('active');
                slideDown(this.nextElementSibling)
                getSiblings(parent).forEach(function (item) {
                    item.classList.remove('active')
                    item.querySelectorAll('.sub-menu').forEach(function (subMenu) {
                        subMenu.parentElement.classList.remove('active');
                        slideUp(subMenu)
                    })
                })
            }
        })
    })
}
offCanvasMenu('.offcanvas-menu');


/*--
    Features Hover Active & packages Hover Active
-----------------------------------*/
const colorsDiv = document.querySelectorAll('.features-wrapper, .packages-wrapper');

colorsDiv.forEach(function (elem) {

    const children = [...elem.children];

    children.forEach((el) => {
        el.addEventListener('mouseenter', (e) => {
            children.forEach((btn) => {
                btn.classList.remove('active');
            })
            e.target.classList.add('active');
        });
    });
})


/*--
    Slider
-----------------------------------*/
var swiper = new Swiper('.slider-active .swiper-container', {
    speed: 600,
    effect: "fade",
    loop: true,
    pagination: {
        el: '.slider-active .swiper-pagination',
        clickable: true,
    },
    // autoplay: {
    //     delay: 8000,
    // },
});


/*--
    Video
-----------------------------------*/
var swiper = new Swiper('.video-active .swiper-container', {
    speed: 600,
    navigation: {
        nextEl: ".video-active .swiper-button-next",
        prevEl: ".video-active .swiper-button-prev",
    },
    // autoplay: {
    //     delay: 8000,
    // },
});


/*--
    Service
-----------------------------------*/
var swiper = new Swiper('.services-active .swiper-container', {
    speed: 600,
    spaceBetween: 50,
    loop: true,
    pagination: {
        el: '.services-active .swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        576: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        }
    },
    // autoplay: {
    //     delay: 8000,
    // },
});


/*--
    Pricing
-----------------------------------*/
var swiper = new Swiper('.pricing-active .swiper-container', {
    speed: 600,
    spaceBetween: 50,
    loop: true,
    pagination: {
        el: '.pricing-active .swiper-pagination',
        clickable: true,
    },
    // autoplay: {
    //     delay: 8000,
    // },
});


/*--
    Testimonial
-----------------------------------*/
var swiper = new Swiper('.testimonial-active .swiper-container', {
    speed: 600,
    spaceBetween: 30,
    slidesPerView: 1,
    loop: true,
    navigation: {
        nextEl: ".testimonial-active .swiper-button-next",
        prevEl: ".testimonial-active .swiper-button-prev",
    },
    // breakpoints: {
    //     0: {
    //         slidesPerView: 1,
    //     },
    //     576: {
    //         slidesPerView: 1,
    //     },
    //     768: {
    //         slidesPerView: 1,
    //     },
    //     992: {
    //         slidesPerView: 2,
    //     },
    //     1200: {
    //         slidesPerView: 2,
    //     }
    // },
    // autoplay: {
    //     delay: 8000,
    // },
});


/*--
    Brand
-----------------------------------*/
var swiper = new Swiper('.brand-active .swiper-container', {
    speed: 600,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
        0: {
            slidesPerView: 2,
        },
        576: {
            slidesPerView: 3,
        },
        768: {
            slidesPerView: 4,
        },
        992: {
            slidesPerView: 5,
        },
        1200: {
            slidesPerView: 5,
            spaceBetween: 80,
        }
    },
    // autoplay: {
    //     delay: 8000,
    // },
});


/*--
    Brand
-----------------------------------*/
var swiper = new Swiper('.product-active .swiper-container', {
    speed: 600,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".product-active .swiper-button-next",
        prevEl: ".product-active .swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        576: {
            slidesPerView: 2,
        }
    },
    // autoplay: {
    //     delay: 8000,
    // },
});


/*--
    Back To Top
-----------------------------------*/
var toTopBtn = document.getElementById('backBtn');

toTopBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

//hide/show button on scroll up/down
var scrollPos = 0;

window.addEventListener('scroll', function () {

    // detects new state and compares it with the new one
    if ((document.body.getBoundingClientRect()).top > scrollPos) {
        toTopBtn.style.display = "none";

    } else {
        toTopBtn.style.display = "block";
    }
    // saves the new position for iteration.
    scrollPos = (document.body.getBoundingClientRect()).top;
});


/*--
   Price Range Slider
-----------------------------------*/
var snapSlider = document.querySelectorAll('.filter-slider-price');

snapSlider.forEach(element => {

    noUiSlider.create(element, {
        start: [500, 3000],
        connect: true,
        range: {
            'min': 0,
            'max': 5000
        }
    });

    var snapValues = [
        document.getElementById('price-value-lower'),
        document.getElementById('price-value-upper')
    ];

    element.noUiSlider.on('update', function (values, handle) {
        snapValues[handle].innerHTML = values[handle];
    });

});



/*--
   Product Quantity
-----------------------------------*/
function increaseCount(a, b) {
    var input = b.previousElementSibling;
    var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
}

function decreaseCount(a, b) {
    var input = b.nextElementSibling;
    var value = parseInt(input.value, 10);
    if (value > 1) {
        value = isNaN(value) ? 0 : value;
        value--;
        input.value = value;
    }
}


/*--
   Tooltip
-----------------------------------*/
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})


/*--
   Tooltip
-----------------------------------*/
var stars = new StarRating('.star-rating');


/*--
    select2
-----------------------------------*/
document.addEventListener("DOMContentLoaded", function (e) {

    // default
    var els = document.querySelectorAll(".select2");
    els.forEach(function (select) {
        NiceSelect.bind(select);
    });
});


/*--
    Light Box
-----------------------------------*/
var lightboxVideo = GLightbox({
    selector: '.glightbox'
});


/*--
    Checkout Account Active
-----------------------------------*/
/**
* getHeight - for elements with display:none
    */
var getHeight = function (el) {
    var el_style = window.getComputedStyle(el),
        el_display = el_style.display,
        el_position = el_style.position,
        el_visibility = el_style.visibility,
        el_max_height = el_style.maxHeight.replace('px', '').replace('%', ''),

        wanted_height = 0;


    // if its not hidden we just return normal height
    if (el_display !== 'none' && el_max_height !== '0') {
        return el.offsetHeight;
    }

    // the element is hidden so:
    // making the el block so we can meassure its height but still be hidden
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.display = 'block';

    wanted_height = el.offsetHeight;

    // reverting to the original values
    el.style.display = el_display;
    el.style.position = el_position;
    el.style.visibility = el_visibility;

    return wanted_height;
},


    /**
    * toggleSlide mimics the jQuery version of slideDown and slideUp
    * all in one function comparing the max-heigth to 0
        */
    toggleSlide = function (el) {
        var el_max_height = 0;

        if (el.getAttribute('data-max-height')) {
            // we've already used this before, so everything is setup
            if (el.style.maxHeight.replace('px', '').replace('%', '') === '0') {
                el.style.maxHeight = el.getAttribute('data-max-height');
            } else {
                el.style.maxHeight = '0';
            }
        } else {
            el_max_height = getHeight(el) + 'px';
            el.style['transition'] = 'max-height 0.5s ease-in-out';
            el.style.overflow = 'hidden';
            el.style.maxHeight = '0';
            el.setAttribute('data-max-height', el_max_height);
            el.style.display = 'block';

            // we use setTimeout to modify maxHeight later than display (to we have the transition effect)
            setTimeout(function () {
                el.style.maxHeight = el_max_height;
            }, 10);
        }
    };

const account = document.querySelectorAll('.account')

account.forEach(element => {

    element.addEventListener('click', function (e) {
        toggleSlide(document.querySelector('.checkout-account'));
    }, false);

});


const shipping = document.querySelectorAll('.shipping')

shipping.forEach(element => {

    element.addEventListener('click', function (e) {
        toggleSlide(document.querySelector('.checkout-shipping'));
    }, false);

});


/*--
    AOS Scroll Animation
-----------------------------------*/
AOS.init({
    once: true,
    duration: 1500,
});
