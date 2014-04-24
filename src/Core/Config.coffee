#<< AE/Singleton

class AE.Config extends AE.Singleton

  setConfig: (@_opts) ->
    if @_opts
      AE.log '--------------------'
      if @_opts['name'] then AE.log "name: " + @_opts['name']
      if @_opts['version'] then AE.log "version: " + @_opts['version']
      AE.log '--------------------'
