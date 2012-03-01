
define(['models/ScheduleCSV', 'cell!views/Schedule'], function(_arg, ScheduleView) {
  var createSchedule, _;
  createSchedule = _arg.createSchedule;
  _ = cell.prototype.$R;
  return {
    init: function() {
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        return alert('The File APIs are not fully supported in this browser.');
      }
    },
    render: function(_) {
      return [_('.drop_zone', 'Drop Schedule CSV'), _('.schedule_container')];
    },
    afterRender: function() {
      var mock_csv,
        _this = this;
      mock_csv = "a,b,c,d,e\n1234,ff-enter,CST,Wed Feb 29 2012 01:00:00 GMT-0600, Wed Feb 29 2012 02:00:00 GMT-0600\n1234,ff-enter,CST,Wed Feb 29 2012 05:00:00 GMT-0600, Wed Feb 29 2012 06:00:00 GMT-0600\n5678,ff-enter,CST,Wed Feb 29 2012 03:00:00 GMT-0600, Wed Feb 29 2012 04:00:00 GMT-0600";
      return createSchedule(mock_csv, function(sched) {
        return _this._render_schedule(sched);
      });
    },
    _render_schedule: function(sched) {
      return this.$('.schedule_container').html('').append(_(ScheduleView, {
        model: sched
      }));
    },
    on: {
      'dragover .drop_zone': function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        return evt.originalEvent.dataTransfer.dropEffect = 'copy';
      },
      'drop .drop_zone': function(evt) {
        var f, reader,
          _this = this;
        f = evt.originalEvent.dataTransfer.files[0];
        reader = new FileReader();
        reader.onload = function(e) {
          return createSchedule(reader.result, function(sched) {
            return console.log(sched);
          });
        };
        return reader.readAsText(f);
      }
    }
  };
});
