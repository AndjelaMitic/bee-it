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

    this.$btn.on('click',tabs.handleBtnClick;
  },

  tabs.handleBtnClick = function (){
    const target = $(this).attr('data-target');
    $(tabs.states.tabActive).removeClass(tabs.states.tabActive);
    $(tabs.states.contentActive).removeClass(tabs.states.contentActive);

    $(this).addClass(tabs.states.tabActive);
    $(`${tabs.selectors.content}[data-content="${target}"]`).addClass(tabs.states.contentActive);

  }
  tabs.init();
