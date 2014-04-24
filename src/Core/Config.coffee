#<< AE/Singleton

class AE.Config extends AE.Singleton

  setConfig: (@_opts) ->
    if @_opts
      if @_opts['name'] then AE.Console.log "Launching " + @_opts['name']
      if @_opts['version'] then AE.Console.log " version: " + @_opts['version']
