define ->
  ms_in_min = 1000*60
  module =

    _get_day: (d)->
      new Date(d.getFullYear(),d.getMonth(),d.getDate())
    _get_day_key: (d)->
      "#{d.getFullYear()}-#{d.getMonth()}-#{d.getDate()}"

    createSchedule: (text,done)->
      module.parseCSV text, (rows)->
        days = {}
        for r in rows
          day = (days[module._get_day_key r.customer_appt_start] ?= {})
          day_date = module._get_day r.customer_appt_start
          (day[r.agent_id] ?= []).push
            start: (r.customer_appt_start.valueOf() - day_date.valueOf())/ms_in_min
            end: (r.customer_appt_end.valueOf() - day_date.valueOf())/ms_in_min
        done days

    parseCSV: (text, done)->
      result = []
      lines = text.split '\n'
      lines.shift()
      for line in lines when (line = line.trim())
        cols = line.split ','
        result.push
          agent_id: Number cols[0]
          objective_id: cols[1]
          customer_tz: cols[2]
          customer_appt_start: new Date cols[3]
          customer_appt_end: new Date cols[4]
      done result