function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
  
    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);
  
    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
  
    return scrollbarWidth;
  
  }
  export { getScrollbarWidth}

  function fe(url, opts) {
    return fetch(url, opts).then(rs => {
      if (rs.ok) return rs.json(); else throw new Error("Network fail!");
    }).then(rs => {
      if (rs.error) throw rs.error;
      else {
        return Promise.resolve(rs);
      }
    }).catch(e => {
      alert(e);
    })
  }
  function clone(x) {
    var z = JSON.parse(JSON.stringify(x));
    return z;
  }
  function _2(v) {
    return v < 10 ? '0' + v : v;
  }
  var div;
  function rawText(complexText) {
    if (complexText && typeof (complexText) === 'string' && complexText.indexOf('<') === -1) return complexText;
    if (!div) {
      div = document.createElement('div');
  
    }
    div.innerHTML = complexText;
    return div.innerText;
  }
  export {fe, clone, _2, rawText}