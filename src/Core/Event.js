/*
    A simple Observer pattern design implementation
 */
export default class Event {
  /*
      constructor: called on instance creation
      @param {Object} the event's sender
   */

  constructor (_sender=null) {
    this._sender      = _sender;
    this._subscribers = [];
  }


  /*
      subscribe: adds a new object to the distribution list
      @param {Object} the listener object to be added
   */

  subscribe (listener) {
    this._subscribers.push(listener);
  }


  /*
    notify: distributes args to every subscriber
    @param {Object} args : an object containing the messages' arguments
   */

  notify (args) {
    let i;
    let j;
    let ref;
    let results;

    results = [];

    for (i = j = 0, ref = this._subscribers.length - 1; j <= ref; i = j += 1) {
      results.push(this._subscribers[i](this._sender, args));
    }

    results;
  }

};
