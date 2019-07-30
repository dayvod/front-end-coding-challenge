import compareStrings from './compareStrings.js';
import createElement from './createElement.js';
import setProps from './setProps.js';

export default class TagBrowserWidget {
  constructor(config) {
    this.config = config;
    //use .bind because native promises change the "this" context
    this.fetchData()
      .then(this.setData.bind(this))
      .then(this.getElements.bind(this))
      .then(this.getTags.bind(this))
      .then(this.bindEventListeners.bind(this))
      .then(this.render.bind(this));

    console.log('Widget Instance Created');
  }

  fetchData() {
    return new Promise((resolve, reject) => {
      //ajax the data and resolve the promise when it comes back
      $.get('/js/data.json', resolve);
    });
  }

  setData(data) {
    this.data = data;
    console.log('Data fetched', this.data);
  }

  getElements() {
    this.tagList = this.config.element.querySelectorAll('.tag-list')[0];
    this.seriesList = this.config.element.querySelector('.js-series-list');
    this.selectedSeries = this.config.element.querySelector(
      '.js-selected-series'
    );
  }

  bindEventListeners() {
    this.tagList.addEventListener('click', this.tagListClicked.bind(this));

    //bind the additional event listener for clicking on a series title
  }

  getUniqueTags(seriesList) {
    let uniqueTags = Object.create(null);
    seriesList.forEach(series => {
      let { tags } = series;
      tags.forEach(tag => {
        uniqueTags[tag] = tag;
      });
    });

    return Object.keys(uniqueTags);
  }

  getTags() {
    let tags = this.getUniqueTags(this.data);
    return tags.sort(compareStrings);
  }

  renderTagList() {
    let tags = this.getTags();
    let tagList = this.tagList;
    let fragment = document.createDocumentFragment();

    let tagItems = tags.map(tag => {
      let elementTag = createElement(
        'li',
        { 'data-tag': tag },
        createElement(
          'button',
          {
            class: 'tag is-link',
            'data-tag': tag,
            type: 'button'
          },
          tag
        )
      );

      fragment.appendChild(elementTag);
    });

    $('.tag').remove();
    tagList.appendChild(fragment);
  }

  render() {
    this.renderTagList();
    //render the list of tags from this.data into this.tagList
  }

  tagListClicked(event) {
    let tag = event.target.getAttribute('data-tag');
    let matchedSeries = this.data.filter(item => {
      return item.tags.includes(tag);
    });
    console.log(matchedSeries);
    //check to see if it was a tag that was clicked and render
    //the list of series that have the matching tags
  }
}
