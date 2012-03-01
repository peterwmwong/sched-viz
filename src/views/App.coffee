define ['models/ScheduleCSV', 'cell!views/Schedule'], ({createSchedule},ScheduleView)->
  _ = cell::$R

  init: ->
    # Check for the various File API support.
    unless window.File and window.FileReader and window.FileList and window.Blob
      alert 'The File APIs are not fully supported in this browser.'

  render: (_)-> [
    _ '.drop_zone', 'Drop Schedule CSV'
    _ '.schedule_container'
  ]

  afterRender: ->
    mock_csv =
      """
      a,b,c,d,e
      1234,ff-enter,CST,Wed Feb 29 2012 01:00:00 GMT-0600, Wed Feb 29 2012 02:00:00 GMT-0600
      1234,ff-enter,CST,Wed Feb 29 2012 05:00:00 GMT-0600, Wed Feb 29 2012 06:00:00 GMT-0600
      5678,ff-enter,CST,Wed Feb 29 2012 03:00:00 GMT-0600, Wed Feb 29 2012 04:00:00 GMT-0600
      """
    createSchedule mock_csv, (sched)=> @_render_schedule(sched)

  _render_schedule: (sched)->
    @$('.schedule_container')
      .html('')
      .append _ ScheduleView, model: sched

  on:
    'dragover .drop_zone': (evt)->
      evt.stopPropagation()
      evt.preventDefault()
      evt.originalEvent.dataTransfer.dropEffect = 'copy'

    'drop .drop_zone': (evt)->
      f = evt.originalEvent.dataTransfer.files[0]
      reader = new FileReader()
      reader.onload = (e)=>
        createSchedule reader.result, (sched)=>
          console.log sched
      reader.readAsText(f);