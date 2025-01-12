package com.gnt.http.form;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.gnt.domain.entity.TTaskBarEntity;

import lombok.Data;

@Data
public class GanttChartForm {

    private String viewProjectID;
    private String viewRole;
    private Date viewFromDate;
    private Date viewToDate;
    private List<TTaskBarEntity> taskBarArray;
	
	public GanttChartForm() {
		this.setViewFromDate(new Date());
		this.setViewToDate(new Date());
		this.setTaskBarArray(new ArrayList<TTaskBarEntity>());
	}
	
}
