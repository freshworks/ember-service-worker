export const PROJECT_REVISION = '{{PROJECT_REVISION}}';

let SUCCESS_HANDLERS = [];
let ERROR_HANDLERS = [];

const COOKIE_NAME = 'service_worker';
// Need to remove once the SW has released to all.
const CLEAR_API_CACHE = () => {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      caches.delete(cacheName);
    });
  });
};

let isServiceWorkerEnabled = getCookie(COOKIE_NAME);
if (isServiceWorkerEnabled) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('{{ROOT_URL}}sw.js', { scope: '{{ROOT_URL}}' })
      .then(function(reg) {
        let current = Promise.resolve();

        for (let i = 0; i < SUCCESS_HANDLERS.length; i++) {
          current = current.then(function() {
            return SUCCESS_HANDLERS[i](reg);
          });
        }

        return current
          .then(function() {
            console.log('Service Worker registration succeeded. Scope is ' + reg.scope);
          });
      })
      .catch(function(error) {
        let current = Promise.resolve();

        for (let i = 0; i < ERROR_HANDLERS.length; i++) {
          current = current.then(function() {
            return ERROR_HANDLERS[i](error);
          });
        }

        return current
          .then(function() {
            console.log('Service Worker registration failed with ' + error);
          });
      });
  }
} else {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {

      for(let registration of registrations) {
        registration.unregister()
      }

      CLEAR_API_CACHE();
    }).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  }
}

function getCookie(c_name) {
   let i,x,y,cookies=document.cookie.split(";");
   for (i=0; i<cookies.length; i++)
   {
      x=cookies[i].substr(0,cookies[i].indexOf("="));
      y=cookies[i].substr(cookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");
      if (x==c_name)
      {
        return unescape(y);
      }
   }
}

export function addSuccessHandler(func) {
  SUCCESS_HANDLERS.push(func);
}

export function addErrorHandler(func) {
  ERROR_HANDLERS.push(func);
}
