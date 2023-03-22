import debounce from './debounce.js';

export class Slide {
  constructor(wrapper, slide) {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = 'active';
    this.changeEvent = new Event('changeEvent');
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  // onMove
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.finalPosition - this.dist.movement;
  }

  moveSlide(currentX) {
    this.dist.lastPosition = currentX;
    this.slide.style.transform = `translate3d(${currentX}px, 0px, 0px)`;
  }

  onMove(event) {
    const pointerPosition =
      event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX;
    const currentX = this.updatePosition(pointerPosition);
    this.moveSlide(currentX);
  }

  // onStart
  onStart(event) {
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      this.movetype = 'mousemove';
    }
    if (event.type === 'touchstart') {
      this.dist.startX = event.changedTouches[0].clientX;
      this.movetype = 'touchmove';
    }

    this.wrapper.addEventListener(this.movetype, this.onMove);
    this.transition(false);
  }

  // onEnd
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) this.activeNextSlide();

    if (this.dist.movement < -120 && this.index.prev !== undefined) this.activePrevSlide();

    if (this.index.prev == undefined || this.index.next == undefined) {
      this.changeSlide(this.index.active);
    }
  }

  onEnd() {
    this.wrapper.removeEventListener(this.movetype, this.onMove);
    this.dist.finalPosition = this.dist.lastPosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  // slideEvents
  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // Slides config
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent);
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => item.element.classList.remove(this.activeClass));
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    this.changeSlide(this.index.next);
  }

  // Resize
  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  // BindEvents
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  init() {
    if (this.wrapper && this.slide) {
      this.bindEvents();
      this.addResizeEvent();
      this.addSlideEvents();
      this.slidesConfig();
      this.changeSlide(0);
      this.transition(true);
      this.onResize();
    }
    return this;
  }
}
export default class SlideNav extends Slide {
  constructor(slide, wrapper) {
    super(slide, wrapper);
    this.bindControlEvents();
  }

  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement('ul');
    control.dataset.control = 'slide';
    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href='#slide${index + 1}'>${index + 1}</a></li>`;
    });
    this.wrapper.appendChild(control);
    return control;
  }

  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
      this.activeControlItem();
    });
    this.wrapper.addEventListener('changeEvent', this.activeControlItem);
  }

  activeControlItem() {
    this.controlArray.forEach((item) => item.classList.remove(this.activeClass));
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl) {
    this.control = document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    this.controlArray.forEach((item, index) => this.eventControl(item, index));
    this.activeControlItem();
  }

  bindControlEvents() {
    // this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}
