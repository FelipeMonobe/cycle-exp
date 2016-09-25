import {run} from '@cycle/xstream-run';
import {button, div, img, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

/**
 * @desc Bootstraps the application
 * @private
 * @function main
 * @param {object} sources object containing drivers to receive input
 * @return {object} sinks object containing streams to output
 */
function main(sources) {
  const buttonClick$ = sources.DOM
    .select('.button')
    .events('click');

  const getRandomGiphy$ = buttonClick$
    .map(() => {
      return {
        url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC',
        category: 'gif'
      };
    });

  const getRandomGiphyData$ = sources.HTTP
    .select('gif')
    .flatten()
    .map(res => res.body)
    .startWith(null);

  const vdom$ = getRandomGiphyData$
    .map(gif =>
      div('.content', [
        button('.button', 'Randomize'),
        gif === null ? null : div('.gif-details', [
          img({attrs: {src: gif.data.fixed_width_downsampled_url}})
        ])
      ])
    );

  const sinks = {
    DOM: vdom$,
    HTTP: getRandomGiphy$
  };

  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
});
