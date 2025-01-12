package com.gnt.http.form;

import java.util.List;

import lombok.Data;

@Data
public class HomeForm {
	private String containsType;
	private String viewUuid;
	private String role;
	private String favorites;
	
	private List<TabForm> tabArray;
	
	private GanttChartForm ganttchartForm;
	private MenuForm menuForm;
	
	@Data
	static public class TabForm{
		private String tabName;
		private String containsType;
		private String uuid;
	}
}
