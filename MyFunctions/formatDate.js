import moment from 'moment';

const toISOFormat = date => {
  let d = moment(date || moment.now()).format('YYYY-MM-DDTHH:mm:ss.SSS');
  console.log(d.toString() + 'Z');
  d = d.toString() + 'Z';
  return Date.parse(d) - 5.5 * 60 * 60 * 1000;
};

const toStringFormat = date => {
  let d = moment(date || moment.now()).format('YYYY-MM-DD HH:mm');
  return d;
};

export {toISOFormat, toStringFormat};
