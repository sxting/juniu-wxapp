/**
 * Created by xiejinbin on 2017/2/22.
 */
import xs from '../lib/xstream/index';
let event = {}

event.fromEvent = (srcObj, propertyName) => {
  const evProducer = {
    start: (listener) => {
      Object.defineProperty(
        srcObj,
        propertyName,
        { value: ev => listener.next(ev) })
    },
    stop: () => { }
  }
  return xs.create(evProducer)
}

module.exports = {
  event: event
}
