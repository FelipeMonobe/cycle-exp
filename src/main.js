import {run} from '@cycle/xstream-run';
import {div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';

/**
* @desc Bootstraps the application
* @private
* @function main
* @param {object} sources object containing drivers to receive input
* @return {object} sinks object containing streams to output
*/
function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('.field').events('input')
      .map(ev => ev.target.value)
      .startWith('')
      .map(name =>
        div([
          label('Name: '),
          input('.field', {attrs: {type: 'text'}}),
          hr(),
          name.trim() ? h1(`Hello ${name}!!`) : h1()
        ])
      )
  };
  return sinks;
}

run(main, {DOM: makeDOMDriver('#app')});
