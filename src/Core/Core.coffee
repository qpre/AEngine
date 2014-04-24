#<< AE/Engine
if (self.document)
  scriptsArray = document.getElementsByTagName 'script'
  currentScript = scriptsArray[scriptsArray.length-1]
  AE_CORE_PATH = currentScript.src.replace /\/script\.js$/, '/'