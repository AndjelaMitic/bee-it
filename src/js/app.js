//--------------------TABS-------------------------------------------------------------------
const tabs = {};
  tabs.selectors = {
    ctx: '.js-packages-tabs',
    btn: '.js-btn',
    content: '.js-content'
  },

  tabs.states = {
    tabActive: 'tabs__btn--active',
    contentActive: 'tabs__content--active'
  }
  tabs.init = function () {

    tabs.$ctx = $(tabs.selectors.ctx);
    tabs.$btn = $(tabs.selectors.btn, tabs.$ctx);
    tabs.$content = $(tabs.selectors.content, tabs.$ctx);

    this.$btn.on('click',tabs.handleBtnClick);
  },

  tabs.handleBtnClick = function (){
    const target = $(this).attr('data-target');
    console.log($(tabs.states.tabActive));
    $(`.${tabs.states.tabActive}`).removeClass(tabs.states.tabActive);
    $(`.${tabs.states.contentActive}`).removeClass(tabs.states.contentActive);

    $(this).addClass(tabs.states.tabActive);
    $(`${tabs.selectors.content}[data-content="${target}"]`).addClass(tabs.states.contentActive);

  }
  tabs.init();



const slider = {};


slider.start = function(sliderSelector){
  //constants
  slider.dynamicClasses = {
     slideTrack: 'slider__track',
     slideSlide: 'slider__slide js-slide',
     slideContainer: 'container',
     slideImage: 'slider__image',
     slideDesc: 'slider__description',
     slideTitle: 'slider__title',
     slideLead: 'slider__lead',
     slideButton: 'slider__button',
     slideControls: 'slider__controls',
     sliderArrow: 'slider__arrow',
     slidePrevious: 'slider__arrow--prev',
     slideNext: 'slider__arrow--next'
  }
  slider.states = {
    disableArrow : 'slider__arrow--disable'
  }

  slider.selectors = {
    ctx: `.${sliderSelector}`,
  }

  slider.remote = {
    dataServlet: 'http://localhost:3000/db'
  }

  // DOM elements
  slider.$ctx = $(slider.selectors.ctx);

  //Variables
  slider.slideIndex = 1;
  slider.count = 0;

  // Getters
  /**
  * Getter for current slide index
  * @returns {Number}
  */
  slider.getCurrentSlide = function(){
    return slider.slideIndex;
  }
  /**
  * Getter for current slide width
  * @returns {Number}
  */
  slider.getSlideWidth = function(){
    return Number(slider.$ctx.width());
  }

  // Methods
  /**
 * Get slider data from API and call render slider
 * @returns {void}
 */
  slider.getData = function(){
    $.ajax({
      url: slider.remote.dataServlet
    })
    .done(function(data){
      slider.count = data.slides.length;
      slider.render(data);
    })
    .fail(function(jqXHR) {
      console.error(`An error occurred! Status code ${jqXHR.status} - ${jqXHR.statusText}`);
      console.warn(jqXHR);
    });
  }
  slider.getData();

  /**
 * Render all slider elements and attaches all event listeners
 * @param {Object} data - Slider JSON data
 * @returns {void}
 */
  slider.render = function(data){
    if (slider.count > 0) {
      if (slider.count > 1) {
        slider.generateArrows(data);
      }
      let track = $(`<div class='${slider.dynamicClasses.slideTrack}'></div>`);
      let slides = [];

      data.slides.forEach((slideData, slideIndex) => {
        let slide = slider.generateSlide(slideData);
        let container = $(`<div class='${slider.dynamicClasses.slideContainer}'></div>`);
        container.append(slider.generateSlideText(slideData));
        slide.append(container);
        slides.push(slide);
      });
      track.append(slides);
      slider.$ctx.append(track);
      slider.checkArrows();
    }
  }

  /**
 * Generate and append controls
 * @param {Object} data - Slider JSON data
 * @returns {void}
 */
  slider.generateArrows = function(data){
    let controls = $(`<div class='${slider.dynamicClasses.slideControls}'></div>`);
    let previous = $(`<a class='${slider.dynamicClasses.sliderArrow} ${slider.dynamicClasses.slidePrevious}' href='#'><img src='${data.arrows.prev}'</a>`);
    previous.click(slider.prev);
    let next = $(`<a class='${slider.dynamicClasses.sliderArrow} ${slider.dynamicClasses.slideNext}' href='#'><img src='${data.arrows.next}'></a>`);
    next.click(slider.next);
    controls.append([previous, next]);
    slider.$ctx.append(controls);
  }

  /**Generate Slider wrapper and Slide image
 * @param {Object} slideData - JSON data for one slide
 * @returns {Object} DOM element
 */
  slider.generateSlide = function(slideData){
    let sliderItem = $(`<div class='${slider.dynamicClasses.slideSlide}'></div>`);
    let image = $(`<img class='${slider.dynamicClasses.slideImage}' src='${slideData.imagePath}' alt='${slideData.imageDesc}'>`);
    return sliderItem.append(image);
  }

  /**
  * Generate Slide Text and Button
  * @param {Object} slideData - JSON data for one slide
  * @returns {Object} DOM element
  */
  slider.generateSlideText = function(slideData) {
    let description = false;

    if (slideData.slideTitle || slideData.slideLead || (slideData.buttonLink && slideData.buttonText)) {
      description = $(`<div class='${slider.dynamicClasses.slideDesc}'></div>`);
      let title = slideData.slideTitle ? $(`<h2 class='${slider.dynamicClasses.slideTitle}'>${slideData.slideTitle}</h2>`) : false;
      let lead = slideData.slideLead ? $(`<p class='${slider.dynamicClasses.slideLead}'>${slideData.slideLead}</p>`) : false;
      let button = slideData.buttonText && slideData.buttonLink ?
        $(`<a class='${slider.dynamicClasses.slideButton}' href='${slideData.buttonLink}'>${slideData.buttonText}</a>`) : false;
      description.append([title, lead, button]);
    }
    return description;
  }

  /**
  * Call checkArrows and slideLeft functions
  * @returns {void}
  */
  slider.prev = function(){
    const btn = $(this);
    if (btn.hasClass(slider.states.disableArrow)) {
      return;
    }
    if (slider.slideIndex -1  >= 1) {
      slider.slideIndex--;
      slider.checkArrows();
      slider.slideLeft();
    } else {
      btn.addClass(slider.states.disableArrow);
    }
  }

  /**
  * Showing previous slide
  * @returns {void}
  */
  slider.slideLeft = function(){
    const slideWidth = slider.getSlideWidth();
    let transform = Number($(`.${slider.dynamicClasses.slideTrack}`).css('transform').split(',')[4]);
    transform += slideWidth;
    slider.setStyle(transform,0.5);
  }

  /**
  * Call checkArrows and slideRight functions
  * @returns {void}
  */
  slider.next = function(){
    const btn = $(this);
    if (btn.hasClass(slider.states.disableArrow)) {
      return;
    }
    if (slider.slideIndex +1  <= slider.count) {
      slider.slideIndex++;
      slider.checkArrows();
      slider.slideRight();
    }
  }

  /**
  * Showing next slide
  * @returns {void}
  */
  slider.slideRight = function(){
    const slideWidth = slider.getSlideWidth();
    let transform = Number($(`.${slider.dynamicClasses.slideTrack}`).css('transform').split(',')[4]);
    transform -= slideWidth;
    slider.setStyle(transform,0.5);
  }

  /**
  * Checking arrows by conditions and call disableArrow or enableArrow functions
  * @returns {void}
  */
  slider.checkArrows = function(){
    if (slider.slideIndex === slider.count) {
      slider.disableArrow(slider.dynamicClasses.slideNext);
    } else {
      slider.enableArrow(slider.dynamicClasses.slideNext);
    }
    if(slider.slideIndex === 1){
      slider.disableArrow(slider.dynamicClasses.slidePrevious);
    } else {
      slider.enableArrow(slider.dynamicClasses.slidePrevious);
    }
  }

  /**
  * Add disable class to the control button
  * @param {String} btn - Selector for control button-arrow
  * @returns {void}
  */
  slider.disableArrow = function(btn){
    $(`.${btn}`).addClass(slider.states.disableArrow);
  }

  /**
  * Remove disable class to the control button
  * @param {String} btn - Selector for control button-arrow
  * @returns {void}
  */
  slider.enableArrow = function(btn){
    $(`.${btn}`).removeClass(slider.states.disableArrow);
  }

  /**
  * Set css style to the slide track
  * @param {Number} position - Numbers to transform track
  * @param {Number} seconds - Numbers to animation track
  * @returns {void}
  */
  slider.setStyle = function (position,seconds){
    const track = $(`.${slider.dynamicClasses.slideTrack}`);
    track.css('transform',`translateX(${position}px)`);
    track.css('transition',`transform ease-in-out ${seconds}s`);
  }

  /**
  * Positioning slide track to current slide
  * @returns {void}
  */
  slider.positioning = function(){
    let currentSlide = slider.getCurrentSlide();
    const slideWidth = slider.getSlideWidth();

    if (currentSlide !== 1) {
      let newPositionCurrentSlide = (--currentSlide)*slideWidth;
      slider.setStyle(-newPositionCurrentSlide,0);
    }
  }
}

slider.start('js-slider');
$(window).on('resize', slider.positioning);
