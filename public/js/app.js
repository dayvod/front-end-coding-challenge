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
    this.seriesList = this.config.element.querySelector('.matching-items-list');
    this.selectedSeries = this.config.element.querySelector('.selected-item');
    this.clearButton = this.config.element.querySelector('.clear-button');
  }

  bindEventListeners() {
    this.tagList.addEventListener('click', this.tagListClicked.bind(this));
    this.seriesList.addEventListener(
      'click',
      this.seriesListClicked.bind(this)
    );
    this.clearButton.addEventListener('click', this.clearWidget.bind(this));
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
        { },
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

    $(tagList).empty();
    tagList.appendChild(fragment);
  }

  render() {
    this.renderTagList();
    //render the list of tags from this.data into this.tagList
  }

  renderSeriesList() {
    let seriesList = this.seriesList;
    let fragment = document.createDocumentFragment();

    this.matchedSeries.forEach(item => {
      fragment.appendChild(
        createElement(
          'li',
          {},
          createElement('a', { 'data-id': item.id }, item.title)
        )
      );
    });

    $(seriesList).empty();
    seriesList.appendChild(fragment);
  }

  renderSelectedItem(id) {
    let selectedItem = this.matchedSeries.find(series => id === series.id);
    let fragment = document.createDocumentFragment();
    // content
    let content = createElement('div', { class: 'content' }, [
      createElement('h3', { class: 'subtitle' }, selectedItem.title),
      createElement('img', { src: selectedItem.thumbnail }),
      createElement('p', {}, selectedItem.description)
    ]);
    let ul = createElement('ul', {}, [
      createElement('li', {}, [
        createElement('strong', {}, 'Rating'),
        createElement('span', {}, selectedItem.rating)
      ]),
      createElement('li', {}, [
        createElement('strong', {}, 'Native Language Title: '),
        createElement('span', {}, selectedItem.nativeLanguageTitle)
      ]),
      createElement('li', {}, [
        createElement('strong', {}, 'Source Country: '),
        createElement('span', {}, selectedItem.sourceCountry)
      ]),
      createElement('li', {}, [
        createElement('strong', {}, 'Type: '),
        createElement('span', {}, selectedItem.type)
      ]),
      createElement('li', {}, [
        createElement('strong', {}, 'Episodes: '),
        createElement('span', {}, selectedItem.episodes)
      ])
    ]);

    fragment.appendChild(content);
    fragment.appendChild(ul);
    $(this.selectedSeries).empty();
    this.selectedSeries.appendChild(fragment);
  }

  renderEmptyItem() {
    let selectedSeries = this.selectedSeries;
    let subtitle = selectedSeries.querySelector('.subtitle');
    let img = createElement('img', {src: 'http://via.placeholder.com/350x350'});

    $(subtitle).replaceWith("<h2 class='subtitle'>No Series Selected</h2>");
    $('.selected-item img').replaceWith(img);
    $('.selected-item p').remove();
    $('.selected-item > ul > li > span').remove();
  }

  seriesListClicked(event) {
    let id = parseInt(event.target.getAttribute('data-id'), 10);
    this.renderSelectedItem(id);
    console.log(event.target);
  }

  tagListClicked(event) {
    let tag = event.target.getAttribute('data-tag');
    this.matchedSeries = this.data.filter(item => {
      return item.tags.includes(tag);
    });

    this.renderSeriesList(this.matchedSeries);
    console.log(this.matchedSeries);
    //check to see if it was a tag that was clicked and render
    //the list of series that have the matching tags
  }

  clearWidget() {
    // $(this.selectedSeries).empty();
    $(this.seriesList).empty();
    this.matchedSeries = [];
    this.renderEmptyItem();
  }
}
