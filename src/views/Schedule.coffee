define ->
  min_in_day = 12*60 # 24 hour day that is...
  render: (_)->
    for day,agents of @model
      _ '.day',
        _ 'table.agent_sched',
          for agent_id, appts of agents
            _ 'tr',
              _ 'td.agent_id', agent_id
              _ 'td.appointments', do->
                lastend = 0
                for {start,end} in appts then [
                  _ '.appt', {style: "left: #{100*start/min_in_day}%; width: #{100*(end-start)/min_in_day}%"}
                ]




