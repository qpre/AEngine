let HTTP = {
  postJSON (url, data) {
    let promise;

    return promise = new Promise(function(resolve, reject) {
      var xhr;
      xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.responseType = 'json';
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return resolve && resolve(xhr.response);
          } else {
            return reject && reject(xhr.response);
          }
        }
      };

      return xhr.send(data);
    });
  },

  getJSON (url) {
    let promise;
    return promise = new Promise(function(resolve, reject) {
      var xhr;
      xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return resolve && resolve(xhr.response);
          } else {
            return reject && reject(xhr.response);
          }
        }
      };
      return xhr.send();
    });
  },
  //TODO: handle as Promise
  getBlobAsync (url, onSuccess=null) {
    let request;

    request = new XMLHttpRequest();
    request.open('GET', URL, true);
    request.responseType = 'blob';

    request.addEventListener('loadend', function() {
      if (request.status === 200) {
        onSuccess && onSuccess(request.response);
      } else {
        return AE.error('could\'nt retrieve file: ' + URL);
      }
    });

    request.send();
  },
  //TODO: handle as Promise
  getBlob (url, onSuccess=null) {
    let request;

    request = new XMLHttpRequest();
    request.open('GET', URL, false);
    request.responseType = 'blob';
    request.send();

    if (request.status === 200) {
      onSuccess && onSuccess(request.response);
    } else {
      AE.error('could\'nt retrieve file: ' + URL);
    }
  }
}


export default HTTP;
