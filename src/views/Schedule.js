
define(function() {
  var min_in_day;
  min_in_day = 12 * 60;
  return {
    render: function(_) {
      var agent_id, agents, appts, day, _ref, _results;
      _ref = this.model;
      _results = [];
      for (day in _ref) {
        agents = _ref[day];
        _results.push(_('.day', _('table.agent_sched', (function() {
          var _results2;
          _results2 = [];
          for (agent_id in agents) {
            appts = agents[agent_id];
            _results2.push(_('tr', _('td.agent_id', agent_id), _('td.appointments', (function() {
              var end, lastend, start, _i, _len, _ref2, _results3;
              lastend = 0;
              _results3 = [];
              for (_i = 0, _len = appts.length; _i < _len; _i++) {
                _ref2 = appts[_i], start = _ref2.start, end = _ref2.end;
                _results3.push([
                  _('.appt', {
                    style: "left: " + (100 * start / min_in_day) + "%; width: " + (100 * (end - start) / min_in_day) + "%"
                  })
                ]);
              }
              return _results3;
            })())));
          }
          return _results2;
        })())));
      }
      return _results;
    }
  };
});
