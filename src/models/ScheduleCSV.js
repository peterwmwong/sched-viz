
define(function() {
  var module, ms_in_min;
  ms_in_min = 1000 * 60;
  return module = {
    _get_day: function(d) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    },
    _get_day_key: function(d) {
      return "" + (d.getFullYear()) + "-" + (d.getMonth()) + "-" + (d.getDate());
    },
    createSchedule: function(text, done) {
      return module.parseCSV(text, function(rows) {
        var day, day_date, days, r, _i, _len, _name, _name2, _ref, _ref2;
        days = {};
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          r = rows[_i];
          day = ((_ref = days[_name = module._get_day_key(r.customer_appt_start)]) != null ? _ref : days[_name] = {});
          day_date = module._get_day(r.customer_appt_start);
          ((_ref2 = day[_name2 = r.agent_id]) != null ? _ref2 : day[_name2] = []).push({
            start: (r.customer_appt_start.valueOf() - day_date.valueOf()) / ms_in_min,
            end: (r.customer_appt_end.valueOf() - day_date.valueOf()) / ms_in_min
          });
        }
        return done(days);
      });
    },
    parseCSV: function(text, done) {
      var cols, line, lines, result, _i, _len;
      result = [];
      lines = text.split('\n');
      lines.shift();
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (!((line = line.trim()))) continue;
        cols = line.split(',');
        result.push({
          agent_id: Number(cols[0]),
          objective_id: cols[1],
          customer_tz: cols[2],
          customer_appt_start: new Date(cols[3]),
          customer_appt_end: new Date(cols[4])
        });
      }
      return done(result);
    }
  };
});
