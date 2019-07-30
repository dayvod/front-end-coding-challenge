function compareStrings(a, b) {
  if (a.toUpperCase().charCodeAt() > b.toUpperCase().charCodeAt()) {
    return 1;
  }

  if (a.toUpperCase().charCodeAt() < b.toUpperCase().charCodeAt()) {
    return -1;
  }

  return 0;
}

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
    console.log(tags.sort(compareStrings));

    return tags.sort(compareStrings);
  }

  render() {
    //render the list of tags from this.data into this.tagList
  }

  tagListClicked(event) {
    console.log('tag list (or child) clicked', event);
    //check to see if it was a tag that was clicked and render
    //the list of series that have the matching tags
  }
}
