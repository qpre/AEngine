class IDFactory {
  /*
      constructor: called on singleton's new instance creation
   */
  constructor () {
    this._guids = [];
  }


  /*
      has: checks if param guid has already been registered
      @param {String} the GUID to be checked
      @return {Boolean} whether the guid was found internally or not
   */

  has (guid) {
    if (this._guids.indexOf(guid.toString()) > -1) {
      return true;
    } else {
      return false;
    }
  };


  /*
    @return {String} a brand new and unique GUID
   */

  getGUID () {
    let newguid;

    newguid = this.guid();

    if (!this.has(newguid)) {
      this._guids.push(newguid);
    } else {
      newguid = this.getGUID();
    }

    return newguid;
  };


  /*
      GUID GENERATION FUNCTIONS
   */

  s4 () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  guid () {
    return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
  };
}

export default IDFactory = new IDFactory();
